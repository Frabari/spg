import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

export type OrderEntryId = number;

@Entity()
export class OrderEntry {
  @PrimaryGeneratedColumn()
  id: OrderEntryId;

  /**
   * The orde to which this order entry belongs
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
  quantity: number;

  /**
   * Whether the farmer that produces this
   * product confirmed the availability
   */
  @Column({ default: false })
  confirmed: boolean;
}
