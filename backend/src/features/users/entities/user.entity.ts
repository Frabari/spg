import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Role } from '../roles.enum';

export type UserId = number;

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

  /**
   * Url pointing to the user avatar
   */
  @Column({ default: null })
  @IsUrl()
  @IsOptional()
  avatar: string;
}