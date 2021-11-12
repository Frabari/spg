import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from './products.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrdersModule } from '../orders/orders.module';
import { Product } from './entities/product.entity';
import { EntityManager } from 'typeorm';
import { Not } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
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
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('handleUpdateAvailability', () => {
    it('should validate if the concerned fields in the db have 0 value', async () => {
      const entityManager = module.get(EntityManager);
      await service.resetProductAvailability();
      const products = await entityManager.find(Product, {
        available: Not(0),
        reserved: Not(0),
        sold: Not(0),
      });
      expect(products.length > 0).toBe(false);
    });
  });

  afterEach(() => {
    return module.close();
  });
});
