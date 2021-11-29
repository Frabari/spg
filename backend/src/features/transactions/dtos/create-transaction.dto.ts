import { OmitType } from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';

export class CreateTransactionDto extends OmitType(Transaction, [
  'id',
  'createdAt',
] as const) {}
