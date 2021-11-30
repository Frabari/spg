import { Allow } from 'class-validator';
import { Column } from 'typeorm';

export class DeliveryLocation {
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
