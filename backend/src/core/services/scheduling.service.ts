import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrdersService } from '../../features/orders/orders.service';
import { ProductsService } from '../../features/products/products.service';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Cron('0 23 * * 0')
  closeWeeklySales() {
    return Promise.all([
      this.productsService.resetProductAvailability(),
      this.ordersService.lockBaskets(),
    ]);
  }
}
