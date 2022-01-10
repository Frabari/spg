import { parseExpression } from 'cron-parser';
import { DateTime } from 'luxon';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerOrchestrator } from '@nestjs/schedule/dist/scheduler.orchestrator';
import {
  NotificationPriority,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/services/notifications.service';
import { OrderStatus } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { Role } from '../users/roles.enum';

const toFaketimeDate = (date: Date) => {
  const res = date.toISOString().replace('T', ' ');
  return res.substring(0, res.length - 5);
};

const CLOSE_WEEKLY_SALES = '0 23 * * 0';
const CLOSE_BASKETS = '0 9 * * 1';
const PAY_PENDING_BASKETS = '0 18 * * 1';
const PICKUP_NOTIFICATION = '0 10 * * *';
const OPEN_SALES = '0 9 * * 6';

@Injectable()
export class SchedulingService {
  private logger = new Logger(SchedulingService.name);

  private jobs = {
    [CLOSE_WEEKLY_SALES]: this.closeWeeklySales,
    [CLOSE_BASKETS]: this.closeBaskets,
    [PAY_PENDING_BASKETS]: this.payPendingBaskets,
    [PICKUP_NOTIFICATION]: this.sendPickupNotifications,
    [OPEN_SALES]: this.openSales,
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly schedulerOrchestrator: SchedulerOrchestrator,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CLOSE_WEEKLY_SALES)
  async closeWeeklySales() {
    this.logger.log(`Closing weekly sales (@${new Date()})`);
    await this.productsService.resetProductsAvailability();
    await this.ordersService.lockBaskets();
  }

  @Cron(CLOSE_BASKETS)
  async closeBaskets() {
    this.logger.log(`Closing baskets (@${new Date()})`);
    await this.ordersService.removeDraftOrderEntries();
    await this.ordersService.closeBaskets();
    await this.ordersService.payBaskets();
  }

  @Cron(PAY_PENDING_BASKETS)
  payPendingBaskets() {
    this.logger.log(`Paying pending baskets (@${new Date()})`);
    return this.ordersService.payBaskets(true);
  }

  @Cron(OPEN_SALES)
  openSales() {
    this.logger.log(`Updating products (@${new Date()})`);
    return this.notificationsService.sendNotification(
      {
        type: NotificationType.INFO,
        priority: NotificationPriority.CRITICAL,
        title: `Sales are now open`,
        message: 'New products available',
      },
      { role: Role.EMPLOYEE },
    );
  }

  getDate() {
    return DateTime.now().toISO();
  }

  async setDate(date: string) {
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
      executions.sort((a, b) => +a.date - +b.date);
      for (const e of executions) {
        process.env.FAKETIME = '@' + toFaketimeDate(e.date);
        await this.jobs[e.key].bind(this).apply();
      }
    }
    this.schedulerOrchestrator.mountTimeouts();
    this.schedulerOrchestrator.mountIntervals();
    this.schedulerOrchestrator.mountCron();
    process.env.FAKETIME = '@' + toFaketimeDate(newDate);
    return newDate.toISOString();
  }

  @Cron(PICKUP_NOTIFICATION)
  async sendPickupNotifications() {
    const orders = await this.ordersService.find({
      where: {
        status: OrderStatus.PAID,
        deliveryLocation: null,
      },
      relations: ['user'],
    });
    if (orders?.length) {
      for (const o of orders) {
        if (
          DateTime.fromJSDate(o.deliverAt).day ===
          DateTime.now().plus({ day: 1 }).day
        ) {
          await this.notificationsService.sendNotification(
            {
              type: NotificationType.INFO,
              priority: NotificationPriority.CRITICAL,
              title: 'Pickup soon',
              message: `Tomorrow at ${o.deliverAt.toLocaleTimeString()} you have a pickup scheduled`,
            },
            o.user,
          );
        }
      }
    }
  }
}
