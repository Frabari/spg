import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Cron('0 23 * * 0')
  async closeWeeklySales(controlled = false) {
    await this.productsService.resetProductsAvailability();
    await this.ordersService.lockBaskets();
    if (controlled) {
      const now = DateTime.now();
      let daysToSynday = 7 - now.weekday;
      if (daysToSynday === 0) {
        if (now.hour >= 23 && now.millisecond >= 0) {
          daysToSynday = 7;
        }
      }
      const date = now
        .plus({
          days: daysToSynday,
        })
        .set({
          hour: 23,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .toString();
      process.env.FAKETIME = date;
    }
  }

  @Cron('0 9 * * 1')
  async closeBaskets() {
    await this.ordersService.removeDraftOrderEntries();
    await this.ordersService.closeBaskets();
    await this.ordersService.payBaskets();
  }

  @Cron('0 18 * * 1')
  payPendingBaskets() {
    return this.ordersService.payBaskets(true);
  }
}
