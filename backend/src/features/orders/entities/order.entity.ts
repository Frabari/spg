import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsIn, IsNotEmpty, IsString, Validate } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { OrderEntry } from './order-entry.entity';
import { Transform } from 'class-transformer';
import { DeliveredBy } from '../validators/delivered-by.validator';

export type OrderId = number;

export enum OrderStatus {
  /**
   * A basket order
   */
  DRAFT = 'draft',

  /**
   * The products were confirmed and the
   * payment was processed
   */
  PAID = 'paid',

  /**
   * The warehouse has prepared the bags
   */
  PREPARED = 'prepared',

  /**
   * The delivery or pickup is in progress
   */
  DELIVERING = 'delivering',

  /**
   * The food was picked up or delivered successfully
   */
  COMPLETED = 'completed',

  /**
   * The order was not picked up by the client or
   * the delivery was unsuccessful. Here the products
   * are still reserved for this order
   */
  PENDING_CANCELLATION = 'pending_cancellation',

  /**
   * The order was canceled due to insufficient balance
   * or after an unsuccessful delivery/handover.
   * Here the products are made available for other orders
   */
  CANCELED = 'canceled',
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
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(OrderStatus))
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
  @Transform(() => Date)
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
  @Validate(DeliveredBy)
  deliveredBy: User;

  /**
   * The date when this order was created
   */
  @CreateDateColumn()
  @Transform(() => Date)
  createdAt: Date;
}
