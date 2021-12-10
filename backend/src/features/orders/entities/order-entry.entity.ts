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
  /**
   * The user has added this item to the basket
   * but the farmer hasn't confirmed it yet
   */
  DRAFT = 'draft',

  /**
   * The farmer has confirmed the availability of
   * this product
   */
  CONFIRMED = 'confirmed',

  /**
   * The farmer has physically delivered this
   * item to the warehouse
   */
  DELIVERED = 'delivered',
}

@Entity()
export class OrderEntry {
  @PrimaryGeneratedColumn()
  id: OrderEntryId;

  /**
   * The order to which this entry belongs
   */
  @ManyToOne(() => Order, order => order.entries)
  order: Order;

  /**
   * The product
   */
  @ManyToOne(() => Product)
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
  status: OrderEntryStatus;
}
