import { PickType } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { OrderEntry } from "../entities/order-entry.entity";

export class UpdateOrderEntryDto extends PickType(OrderEntry, [
    'status',
    'quantity',
]as const) {

}