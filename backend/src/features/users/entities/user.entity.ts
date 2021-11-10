import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';

export type UserId = number;

export enum Role {
  CUSTOMER = 'customer',
  FARMER = 'farmer',
  RIDER = 'rider',
  EMPLOYEE = 'employee',
  WAREHOUSE_WORKER = 'warehouse_worker',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  MANAGER = 'manager',
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
  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The password hash
   */
  @Column()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  /**
   * The role of this user
   */
  @Column({ default: Role.CUSTOMER })
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Role))
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
