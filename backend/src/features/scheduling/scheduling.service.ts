import { parseExpression } from 'cron-parser';
import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerOrchestrator } from '@nestjs/schedule/dist/scheduler.orchestrator';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

const CLOSE_WEEKLY_SALES = '0 23 * * 0';
const CLOSE_BASKETS = '0 9 * * 1';
const PAY_PENDING_BASKETS = '0 18 * * 1';

@Injectable()
export class SchedulingService {
  private jobs = {
    [CLOSE_WEEKLY_SALES]: this.closeWeeklySales,
    [CLOSE_BASKETS]: this.closeBaskets,
    [PAY_PENDING_BASKETS]: this.payPendingBaskets,
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly schedulerOrchestrator: SchedulerOrchestrator,
  ) {}

  @Cron(CLOSE_WEEKLY_SALES)
  async closeWeeklySales() {
    await this.productsService.resetProductsAvailability();
    await this.ordersService.lockBaskets();
  }

  @Cron(CLOSE_BASKETS)
  async closeBaskets() {
    await this.ordersService.removeDraftOrderEntries();
    await this.ordersService.closeBaskets();
    await this.ordersService.payBaskets();
  }

  @Cron(PAY_PENDING_BASKETS)
  payPendingBaskets() {
    return this.ordersService.payBaskets(true);
  }

  getDate() {
    return DateTime.now().toString();
  }

  setDate(date: string) {
    this.schedulerOrchestrator.clearTimeouts();
    this.schedulerOrchestrator.clearIntervals();
    this.schedulerOrchestrator.closeCronJobs();
    const newDate = new Date(date);
    const oldDate = DateTime.now().toJSDate();
    if (+newDate > +oldDate) {
      const executions: { key: string; date: Date }[] = [];
      Object.keys(this.jobs)
        .map(j => ({
          exp: parseExpression(j),
          key: j,
        }))
        .forEach(e => {
          let nextExecutionDate = e.exp.next().toDate();
          while (+nextExecutionDate <= +newDate) {
            executions.push({
              key: e.key,
              date: nextExecutionDate,
            });
            nextExecutionDate = e.exp.next().toDate();
          }
        });
      executions
        .sort((a, b) => +a.date - +b.date)
        .forEach(e => {
          process.env.FAKETIME = e.date.toISOString();
          this.jobs[e.key].bind(this).apply();
        });
    }
    this.schedulerOrchestrator.mountTimeouts();
    this.schedulerOrchestrator.mountIntervals();
    this.schedulerOrchestrator.mountCron();
    process.env.FAKETIME = date;
    return newDate.toString();
  }
}
