import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { OrderEntry } from './order-entry.entity';

export type OrderId = number;

export const enum OrderStatus {
  /**
   * A basket order
   */
  DRAFT,

  /**
   * The products were confirmed and the
   * payment was processed
   */
  PAID,

  /**
   * The warehouse has prepared the bags
   */
  PREPARED,

  /**
   * The delivery or pickup is in progress
   */
  DELIVERING,

  /**
   * The food was picked up or delivered successfully
   */
  COMPLETED,

  /**
   * The order was not picked up by the client or
   * the delivery was unsuccessful. Here the products
   * are still reserved for this order
   */
  PENDING_CANCELLATION,

  /**
   * The order was canceled due to insufficient balance
   * or after an unsuccessful delivery/handover.
   * Here the products are made available for other orders
   */
  CANCELED,
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: OrderId;

  /**
   * The user who will receive this order
   */
  @ManyToOne(() => User, user => user.orders)
  user: User;

  /**
   * The status of the order. An order with status == DRAFT
   * is the active basket
   */
  @Column({ default: OrderStatus.DRAFT, nullable: false })
  @IsNotEmpty()
  status: OrderStatus;

  /**
   * An array of products with their respective quantities
   */
  @OneToMany(() => OrderEntry, entry => entry.order, { cascade: true })
  entries: OrderEntry[];

  /**
   * The date when the user wants the order to be delivered
   * or to pick it up at the warehouse
   */
  @Column({ default: null })
  deliverAt: Date;

  /**
   * A string representing an address. If null the order will
   * be picked up at the warehouse
   */
  @Column({ default: null })
  deliveryLocation: string;

  /**
   * The rider who will deliver this order. If null the order
   * will be picked up by the customer at the warehouse
   */
  @ManyToOne(() => User)
  deliveredBy: User;

  /**
   * The date when this order was created
   */
  @CreateDateColumn()
  createdAt: Date;
}
