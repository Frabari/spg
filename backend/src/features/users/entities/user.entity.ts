import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

export type UserId = number;

export enum Role {
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

  /**
   * First name
   */
  @Column()
  @IsNotEmpty()
  name: string;

  /**
   * Last name
   */
  @Column()
  @IsNotEmpty()
  surname: string;

  /**
   * The email (username)
   */
  @Column()
  @IsEmail()
  email: string;

  /**
   * The password hash
   */
  @Column()
  @Exclude({ toPlainOnly: true })
  password?: string;

  /**
   * The role of this user
   */
  @Column({ default: Role.CUSTOMER })
  @IsNotEmpty()
  role: Role;

  /**
   * The balance of this account
   *
   * @role CUSTOMER, FARMER
   */
  @Column({ default: 0, nullable: false })
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
   * The products produced by this farmer
   *
   * @roles FARMER
   */
  @OneToMany(() => Product, su => su.farmer)
  products: Product[];
}
