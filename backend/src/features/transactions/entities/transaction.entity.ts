import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type TransactionId = number;

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: TransactionId;

  /**
   * The user to which this transaction applies
   */
  @ManyToOne(() => User, user => user.transactions)
  @IsNotEmpty()
  user: User;

  /**
   * The negative (payment) and positive (top-up)
   * amount of this transaction
   */
  @Column({ default: 0 })
  @IsNotEmpty()
  amount: number;

  /**
   * The date when this transaction was created
   */
  @CreateDateColumn()
  @Type(() => Date)
  createdAt: Date;
}
