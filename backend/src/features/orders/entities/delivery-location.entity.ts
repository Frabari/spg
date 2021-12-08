import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
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
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsString()
  surname: string;

  @Column({ nullable: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  address: string;

  @Column({ nullable: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  zipCode: string;

  @Column({ nullable: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  city: string;

  @Column({ nullable: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  province: string;

  @Column({ nullable: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  region: string;
}
