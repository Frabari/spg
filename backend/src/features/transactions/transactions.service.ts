import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService extends TypeOrmCrudService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) {
    super(transactionsRepository);
  }

  async checkTransaction(dto: CreateTransactionDto) {
    const user = await this.usersService.findOne(dto.user.id);
    if (!user) {
      throw new NotFoundException(
        'Transaction.UserNotFound',
        'Transaction user not found',
      );
    }
    if (user.balance + dto.amount < 0) {
      throw new BadRequestException(
        'Transaction.InsufficientBalance',
        `The user's balance cannot satisfy this transaction`,
      );
    }
    await this.usersService.updateBalance(user, dto.amount);
    return dto;
  }
}
