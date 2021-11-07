import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Order } from '../../orders/entities/order.entity';
import { StockUnit } from '../../stock/entities/stock-unit.entity';

export type UserId = number;

export const enum Role {
  CUSTOMER,
  FARMER,
  RIDER,
  EMPLOYEE,
  WAREHOUSE_WORKER,
  WAREHOUSE_MANAGER,
  MANAGER,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: UserId;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  /**
   * The role of this user
   */
  @Column({ default: Role.CUSTOMER })
  role: Role;

  /**
   * The balance of this account
   *
   * @role CUSTOMER, FARMER
   */
  @Column({ default: 0 })
  balance: number;

  /**
   * The orders created by this user
   *
   * @roles CUSTOMER
   */
  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  /**
   * The transactions that updated this user's
   * balance
   *
   * @roles CUSTOMER, FARMER
   */
  @OneToMany(() => Transaction, tr => tr.user)
  transactions: Transaction[];

  /**
   * The deliveries assigned to this rider
   *
   * @roles RIDER
   */
  @OneToMany(() => Order, order => order.deliveredBy)
  deliveries: Order[];

  /**
   * The stock units created by this farmer
   *
   * @roles FARMER
   */
  @OneToMany(() => StockUnit, su => su.farmer)
  stockUnits: StockUnit[];
}
