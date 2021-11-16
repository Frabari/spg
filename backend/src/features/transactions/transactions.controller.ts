import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Crud } from '../../core/decorators/crud.decorator';
import { ADMINS } from '../users/roles.enum';
import { Roles } from '../users/roles.decorator';

@Crud(Transaction, {
  routes: {
    only: ['createOneBase'],
  },
  dto: {
    create: CreateTransactionDto,
  },
})
@ApiTags(Transaction.name)
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController implements CrudController<Transaction> {
  constructor(public readonly service: TransactionsService) {}

  get base(): CrudController<Transaction> {
    return this;
  }

  @Override()
  @Roles(...ADMINS)
  async createOne(
    @ParsedRequest() request: CrudRequest,
    @ParsedBody() dto: CreateTransactionDto,
  ) {
    const transaction = await this.service.checkTransaction(dto);
    return this.base.createOneBase(request, transaction as Transaction);
  }
}
