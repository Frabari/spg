import { EntityManager } from 'typeorm';
import { Not } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { UsersModule } from '../users/users.module';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsModule } from './products.module';
import { ProductsService } from './products.service';

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

  describe('reserveProductAmount', () => {
    it('should validate if reserved field of product is changed after the called function', async () => {
      const entityManager = module.get(EntityManager);
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
      });
      await service.reserveProductAmount(product, 8);
      const productUpdated = await entityManager.findOne(Product, {
        id: product.id,
      });
      expect(productUpdated.available).toEqual(2);
      expect(productUpdated.reserved).toEqual(8);
    });
  });

  describe('checkProduct', () => {
    it('should validate a product dto', async () => {
      const dto = {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
      } as CreateProductDto;
      const result = await service.checkProduct(dto, {
        id: 1,
        role: Role.EMPLOYEE,
      } as User);
      expect(result).toBeDefined();
    });

    it('should limit the fields for farmers', async () => {
      const dto = {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
        reserved: 5,
      } as CreateProductDto;
      const result = await service.checkProduct(dto, {
        id: 1,
        role: Role.FARMER,
      } as User);
      expect(result.reserved).toBeUndefined();
    });
  });

  afterEach(() => {
    return module.close();
  });
});
