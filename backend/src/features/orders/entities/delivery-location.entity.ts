import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class DeliveryLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, order => order.deliveryLocation)
  order: Order;

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
