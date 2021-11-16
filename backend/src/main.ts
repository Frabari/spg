import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { User } from './features/users/entities/user.entity';
import { Category } from './features/categories/entities/category.entity';
import { Order } from './features/orders/entities/order.entity';
import { Product } from './features/products/entities/product.entity';
import { Transaction } from './features/transactions/entities/transaction.entity';
import { validation } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validation));
  const config = new DocumentBuilder()
    .setTitle('Basil API')
    .setDescription('Solidarity purchase groups')
    .setVersion(version)
    .addBearerAuth()
    .addTag(User.name, 'Users management and authentication')
    .addTag(Product.name, 'Products management')
    .addTag(Category.name, 'Products categorization')
    .addTag(Order.name, 'Orders and basket management')
    .addTag(Transaction.name, 'Transactions and payments')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3001);
}
bootstrap();
