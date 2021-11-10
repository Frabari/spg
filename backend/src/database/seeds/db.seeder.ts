import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Product } from '../../features/products/entities/product.entity';
import { Category } from '../../features/categories/entities/category.entity';
import { Role, User } from '../../features/users/entities/user.entity';
import * as faker from 'faker';
import { passwordTest } from '../constants';

let firstN = -1;

function checkFarmer(role: any, n: number, products: Product[]) {
  let prods = [];

  if (firstN === -1) firstN = n;
  if (role === Role.FARMER && firstN === n) {
    prods = products.slice(0, 25);
  } else if (role === Role.FARMER && firstN !== n)
    prods = products.slice(25, 50);

  return prods;
}

export default class DbSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const entityManager = connection.createEntityManager();
    const products = await entityManager.save(
      await factory(Product)().createMany(50),
    );

    Object.values(Role).forEach(role => {
      [1, 2].forEach(n => {
        entityManager.save(User, {
          role: role,
          email: `${role}${n}@example.com`,
          name: faker.name.firstName(),
          surname: faker.name.lastName(),
          password: passwordTest,
          products: checkFarmer(role, n, products),
        });
      });
    });

    await entityManager.save(Category, [
      {
        id: 1,
        name: 'Vegetables',
        slug: 'vegetables',
        products: products.slice(0, 10),
      },
      {
        id: 2,
        name: 'Fruits',
        slug: 'fruits',
        products: products.slice(10, 20),
      },
      {
        id: 3,
        name: 'Dairy Products',
        slug: 'dairy-products',
        products: products.slice(20, 30),
      },
      {
        id: 4,
        name: 'Breeding',
        slug: 'breeding',
        products: products.slice(30, 40),
      },
      { id: 5, name: 'Meat', slug: 'meat', products: products.slice(40, 50) },
    ]);
  }
}
