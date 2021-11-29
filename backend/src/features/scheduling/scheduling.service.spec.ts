import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { SchedulingService } from './scheduling.service';

describe('SchedulingService', () => {
  let service: SchedulingService;
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
      ],
      providers: [SchedulingService],
    }).compile();
    service = module.get<SchedulingService>(SchedulingService);
  });

  describe('closeWeeklySales', () => {
    it('should close the weekly sales', () => {
      return expect(service.closeWeeklySales()).resolves.toBeUndefined();
    });
  });

  afterEach(() => {
    return module.close();
  });
});
