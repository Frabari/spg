import { Allow } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class DeliveryLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, order => order.deliveryLocation)
  order: Order;

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
