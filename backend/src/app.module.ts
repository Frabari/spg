import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as DbConfig from '../ormconfig.json';
import { CategoriesModule } from './features/categories/categories.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { OrdersModule } from './features/orders/orders.module';
import { ProductsModule } from './features/products/products.module';
import { SchedulingModule } from './features/scheduling/scheduling.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { UsersModule } from './features/users/users.module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
const { entities, ...dbConfig } = DbConfig;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(dbConfig as any),
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    TransactionsModule,
    SchedulingModule,
    NotificationsModule,
  ],
})
export class AppModule {}
