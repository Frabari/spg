import { Allow } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

export type DeliveryLocationId = number;

@Entity()
export class DeliveryLocation {
  @PrimaryGeneratedColumn()
  id: DeliveryLocationId;

  @OneToOne(() => Order, order => order.deliveryLocation)
  order: Order;

  @OneToOne(() => User, user => user.address)
  user: User;

  @Column({ nullable: true })
  @Allow()
  name: string;

  @Column({ nullable: true })
  @Allow()
  surname: string;

  @Column({ nullable: true })
  @Allow()
  address: string;

  @Column({ nullable: true })
  @Allow()
  zipCode: string;

  @Column({ nullable: true })
  @Allow()
  city: string;

  @Column({ nullable: true })
  @Allow()
  province: string;

  @Column({ nullable: true })
  @Allow()
  region: string;
}
