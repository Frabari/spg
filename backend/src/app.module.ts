import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as DbConfig from '../ormconfig.json';
import { UsersModule } from './features/users/users.module';
import { ProductsModule } from './features/products/products.module';
import { CategoriesModule } from './features/categories/categories.module';
import { OrdersModule } from './features/orders/orders.module';
import { TransactionsModule } from './features/transactions/transactions.module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { entities, ...dbConfig } = DbConfig;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(dbConfig as any),
      autoLoadEntities: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
