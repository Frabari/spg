import { hash } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockNotificationsService } from '../../../test/utils';
import { CategoriesModule } from '../categories/categories.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from './transactions.module';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          dropSchema: true,
          synchronize: true,
        }),
        UsersModule,
        ProductsModule,
        CategoriesModule,
        TransactionsModule,
        OrdersModule,
        NotificationsModule,
      ],
    })
      .overrideProvider(NotificationsService)
      .useValue(mockNotificationsService)
      .compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('checkTransaction', () => {
    it('should fail when the related user is missing', () => {
      expect(
        service.validateTransactionCreateDto({
          user: { id: 1 } as User,
          amount: 10,
        }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should fail when user balance is insufficient to satisfy the amount', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      await expect(
        service.validateTransactionCreateDto({
          user,
          amount: -10,
        }),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should update the user balance', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      await service.validateTransactionCreateDto({
        user,
        amount: 10,
      });
      const updatedUser = await entityManager.findOne(User, user.id);
      expect(updatedUser.balance).toEqual(10);
    });
  });
  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const transaction = await service.createTransaction({
        user,
        amount: 10,
      });
      const transactionSaved = await service.findOne(transaction.id);
      expect(transactionSaved.id).toEqual(transaction.id);
    });
  });

  afterEach(() => {
    return module.close();
  });
});
