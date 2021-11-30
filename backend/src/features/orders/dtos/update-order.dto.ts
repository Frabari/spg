import { PickType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class UpdateOrderDto extends PickType(Order, [
  'status',
  'entries',
  'deliveryLocation',
  'deliverAt',
  'deliveredBy',
] as const) {}
