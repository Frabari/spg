import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

export type OrderEntryId = number;

export enum OrderEntryStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
}

@Entity()
export class OrderEntry {
  @PrimaryGeneratedColumn()
  id: OrderEntryId;

  /**
   * The order to which this entry belongs
   */
  @ManyToOne(() => Order, order => order.entries, {
    orphanedRowAction: 'delete',
  })
  order: Order;

  /**
   * The product
   */
  @ManyToOne(() => Product, product => product.orderEntries)
  @IsNotEmpty()
  product: Product;

  /**
   * Product count
   */
  @Column({ default: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(1)
  quantity: number;

  /**
   * The status of this order-entry
   */
  @Column({ default: OrderEntryStatus.DRAFT })
  @IsString()
  @IsIn(Object.values(OrderEntryStatus))
  status?: OrderEntryStatus;
}
