import { PickType } from '@nestjs/swagger';
import { OrderEntry } from '../entities/order-entry.entity';

export class UpdateOrderEntryDto extends PickType(OrderEntry, [
  'status',
  'quantity',
] as const) {}
