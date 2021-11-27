import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../../features/categories/categories.module';
import { OrdersModule } from '../../features/orders/orders.module';
import { ProductsModule } from '../../features/products/products.module';
import { TransactionsModule } from '../../features/transactions/transactions.module';
import { UsersModule } from '../../features/users/users.module';
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
      return expect(service.closeWeeklySales()).resolves.toBeDefined();
    });
  });

  afterEach(() => {
    return module.close();
  });
});
