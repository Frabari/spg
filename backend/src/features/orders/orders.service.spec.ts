import { hash } from 'bcrypt';
import { DateTime } from 'luxon';
import { EntityManager } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { UsersModule } from '../users/users.module';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderEntry } from './entities/order-entry.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
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

    service = module.get<OrdersService>(OrdersService);
  });

  describe('checkOrder', () => {
    it('should validate if the date of the order is between (Wed 08:00 - Fri 18:00)', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
      });
      return expect(
        service.checkOrder({
          user: { id: user.id } as User,
          entries: [{ product, quantity: 5 }] as OrderEntry[],
          deliverAt: DateTime.fromObject({
            weekday: 6,
            hour: 11,
            minute: 0,
            second: 0,
          }).toJSDate(),
        } as CreateOrderDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should validate if the quantity of the order is higher than its product', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
      });
      return expect(
        service.checkOrder({
          user: { id: user.id } as User,
          entries: [{ product, quantity: 20 }] as OrderEntry[],
        } as CreateOrderDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('checkOrderUpdate', () => {
    it('should change the status of the order with a following one', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const order = await entityManager.save(Order, {
        user: { id: user.id },
      });
      expect(
        await service.checkOrderUpdate(
          order.id,
          {
            status: OrderStatus.PAID,
          } as UpdateOrderDto,
          { role: Role.MANAGER } as User,
        ),
      ).toMatchObject({ status: OrderStatus.PAID });
    });

    it('should fail if the status of the updated order is a previous one', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });

      const order = await entityManager.save(Order, {
        user: { id: user.id },
        status: OrderStatus.PAID,
      });
      return expect(
        service.checkOrderUpdate(
          order.id,
          {
            status: OrderStatus.DRAFT,
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if the order status is locked', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        price: 10,
        available: 10,
      });
      let order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      await service.checkOrderUpdate(
        order.id,
        {
          status: OrderStatus.LOCKED,
          entries: [
            {
              ...order.entries[0],
              quantity: 10,
            },
          ],
        } as UpdateOrderDto,
        user,
      );

      order = await entityManager.findOne(Order, order.id, {
        relations: ['entries', 'entries.product'],
      });
      expect(order.entries[0].quantity).toEqual(5);
    });
  });

  afterEach(() => {
    return module.close();
  });
});
