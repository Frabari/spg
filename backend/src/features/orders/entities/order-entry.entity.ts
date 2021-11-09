import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export type OrderEntryId = number;

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
  product: Product;

  /**
   * Product count
   */
  @Column({ default: 1 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  /**
   * Whether the farmer that produces this
   * product confirmed the availability
   */
  @Column({ default: false })
  confirmed: boolean;
}