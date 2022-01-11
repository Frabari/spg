import { hash } from 'bcrypt';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validation } from '../src/constants';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { Category } from '../src/features/categories/entities/category.entity';
import { NotificationsModule } from '../src/features/notifications/notifications.module';
import { NotificationsService } from '../src/features/notifications/services/notifications.service';
import { OrdersModule } from '../src/features/orders/orders.module';
import { Product } from '../src/features/products/entities/product.entity';
import { ProductsModule } from '../src/features/products/products.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/users/roles.enum';
import { UsersModule } from '../src/features/users/users.module';
import { checkKeys, mockNotificationsService } from './utils';

describe('ProductsController (e2e)', () => {
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
        NotificationsModule,
      ],
    })
      .overrideProvider(NotificationsService)
      .useValue(mockNotificationsService)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validation));
    await app.init();
  });

  describe('GET /products', () => {
    it('should not work if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/products').expect(200);
    });

    it('should not return unlisted products to customers', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      await entityManager.insert(Product, {
        name: 'Name',
        description: 'Description',
        baseUnit: '1Kg',
        price: 10,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/products')
        .auth(authToken, { type: 'bearer' })
        .expect(r => {
          expect(r.body.length).toEqual(0);
        });
    });

    it('should fail if the product availability is 0 (both for private and public products)', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      await entityManager.insert(Product, {
        name: 'Name',
        description: 'Description',
        baseUnit: '1Kg',
        public: true,
        price: 10,
        available: 0,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/products')
        .auth(authToken, { type: 'bearer' })
        .expect(r => {
          expect(r.body.length).toEqual(0);
        });
    });

    it('should return the public products', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.MANAGER,
      });
      await entityManager.save(Product, {
        name: 'Name',
        description: 'Description',
        public: true,
        price: 10,
        available: 5,
        baseUnit: '1Kg',
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
        .expect(response => {
          checkKeys<Product>(
            response.body[0],
            [
              'id',
              'public',
              'name',
              'description',
              'price',
              'baseUnit',
              'available',
              'reserved',
              'farmer',
              'image',
            ],
            [],
          );
          expect(r => {
            expect(r.body.length).toEqual(1);
          });
        });
    });

    it('should return all the products present in stock', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.MANAGER,
      });
      await entityManager.save(Product, {
        name: 'Name',
        description: 'Description',
        public: true,
        price: 10,
        available: 5,
        baseUnit: '1Kg',
      });
      await entityManager.save(Product, {
        name: 'Name2',
        description: 'Description2',
        public: false,
        price: 15,
        available: 5,
        baseUnit: '1Kg',
      });
      await entityManager.save(Product, {
        name: 'Name2',
        description: 'Description2',
        public: true,
        price: 20,
        available: 0,
        baseUnit: '1Kg',
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/products/stock')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(response => {
          checkKeys<Product>(
            response.body[0],
            [
              'id',
              'public',
              'name',
              'description',
              'price',
              'baseUnit',
              'available',
              'reserved',
              'farmer',
              'image',
            ],
            [],
          );
          expect(r => {
            expect(r.body.length).toEqual(3);
          });
        });
    });
  });

  describe('PATCH /products/stock/:id', () => {
    it('should update a stock item if the requester is authenticated', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.save(User, {
        name: 'John',
        surname: 'Doe',
        email,
        password: await hash(password, 10),
        role: Role.MANAGER,
      });
      const product = await entityManager.save(Product, {
        name: 'Name',
        description: 'Description',
        public: true,
        price: 10,
        available: 5,
        baseUnit: '1Kg',
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      const name = 'Name2';
      return request(server)
        .patch(`/products/stock/${product.id}`)
        .auth(authToken, { type: 'bearer' })
        .send({ name })
        .expect(response => {
          checkKeys<Product>(
            response.body,
            [
              'id',
              'public',
              'name',
              'description',
              'price',
              'baseUnit',
              'available',
              'reserved',
              'farmer',
              'image',
            ],
            [],
          );
          expect(response.body.name).toEqual(name);
        });
    });
  });

  describe('POST /products/stock', () => {
    it('should create a new product', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.save(User, {
        name: 'John',
        surname: 'Doe',
        email,
        password: await hash(password, 10),
        role: Role.MANAGER,
      });
      const category = await entityManager.save(Category, {
        name: 'Test category',
        slug: 'test-category',
      });
      const farmer = await entityManager.save(User, {
        name: 'Test name',
        surname: 'Test surname',
        email: 'test@email.com',
        password: await hash(password, 10),
        role: Role.FARMER,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      await request(app.getHttpServer())
        .post('/products/stock')
        .auth(authToken, { type: 'bearer' })
        .send({
          public: true,
          name: 'name',
          description: 'description',
          price: 10,
          baseUnit: '1Kg',
          available: 5,
          image: 'https://image.png',
          category,
          farmer,
        })
        .expect(201)
        .expect(response => {
          checkKeys<Product>(
            response.body,
            [
              'id',
              'public',
              'name',
              'description',
              'price',
              'baseUnit',
              'available',
              'farmer',
              'image',
              'category',
            ],
            [],
          );
        });
      expect((await entityManager.find(Product)).length).toEqual(1);
    });

    it('should fail if some fields are missing', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.save(User, {
        name: 'John',
        surname: 'Doe',
        email,
        password: await hash(password, 10),
        role: Role.MANAGER,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(app.getHttpServer())
        .post('/products/stock')
        .auth(authToken, { type: 'bearer' })
        .send({
          name: 'name',
        })
        .expect(400);
    });
  });

  afterEach(() => {
    return app.close();
  });
});
