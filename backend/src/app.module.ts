import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as DbConfig from '../ormconfig.json';
import { SchedulingService } from './core/services/scheduling.service';
import { CategoriesModule } from './features/categories/categories.module';
import { OrdersModule } from './features/orders/orders.module';
import { ProductsModule } from './features/products/products.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { UsersModule } from './features/users/users.module';

// eslint-disable-next-line unused-imports/no-unused-vars,@typescript-eslint/no-unused-vars
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
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulingService],
})
export class AppModule {}
