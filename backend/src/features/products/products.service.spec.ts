import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from './products.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrdersModule } from '../orders/orders.module';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
