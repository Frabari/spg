import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Product } from '../../features/products/entities/product.entity';

define(Product, (faker: typeof Faker) => {
  const product = new Product();
  product.name = faker.commerce.productName();
  return product;
});
