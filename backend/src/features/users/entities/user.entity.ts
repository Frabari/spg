import { Exclude, Type } from 'class-transformer';
import {
  Allow,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';
import { DeliveryLocation } from '../../orders/entities/delivery-location.entity';
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
  @IsString()
  name: string;

  /**
   * Last name
   */
  @Column()
  @IsString()
  surname: string;

  /**
   * The email (username)
   */
  @Column({ unique: true })
  @IsString()
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
   * Company name
   */
  @Column({ default: null })
  @IsString()
  companyName: string;

  /**
   * Url pointing to the company image
   */
  @Column({ default: null })
  @IsUrl()
  @IsOptional()
  companyImage: string;

  /**
   * Url pointing to the user avatar
   */
  @Column({ default: null })
  @IsUrl()
  @IsOptional()
  avatar: string;

  /**
   * The notifications delivered to this user
   */
  @ManyToMany(() => Notification, notification => notification.deliveredTo)
  notifications: Notification[];

  @OneToOne(() => DeliveryLocation, dl => dl.user, {
    cascade: true,
  })
  @JoinColumn()
  @Allow()
  @Type(() => DeliveryLocation)
  @ValidateNested()
  address: DeliveryLocation;

  @Column()
  @Generated('uuid')
  telegramToken: string;

  @Column({ nullable: true })
  telegramId: number;
}
