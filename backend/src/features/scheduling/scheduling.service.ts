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
  closeWeeklySales() {
    return Promise.all([
      this.productsService.resetProductsAvailability(),
      this.ordersService.lockBaskets(),
    ]);
  }
}
