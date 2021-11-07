import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderEntry } from './entities/order-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderEntry])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
