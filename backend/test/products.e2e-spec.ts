import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { hash } from 'bcrypt';
import { UsersModule } from '../src/features/users/users.module';
import { OrdersModule } from '../src/features/orders/orders.module';
import { ProductsModule } from '../src/features/products/products.module';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/users/roles.enum';
import { validation } from '../src/constants';
import { Product } from '../src/features/products/entities/product.entity';

describe('ProductssController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validation));
    await app.init();
  });

  describe('GET /products', () => {
    it('should fail if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/products').expect(401);
    });

    it('should return the products', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.MANAGER,
      });
      await entityManager.insert(Product, {
        name: 'John',
        description: 'Description',
        public: true,
        price: 10,
        available: 5,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/products')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(r => {
          expect(r.body.length).toEqual(1);
        });
    });
  });

  afterEach(() => {
    return app.close();
  });
});
