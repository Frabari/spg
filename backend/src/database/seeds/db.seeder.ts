import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Product } from '../../features/products/entities/product.entity';
import { Category } from '../../features/categories/entities/category.entity';
import { User } from '../../features/users/entities/user.entity';

export default class DbSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const entityManager = connection.createEntityManager();
    const users = await factory(User)().createMany(15);
    const products = await entityManager.save(await factory(Product)().createMany(50));

    users[14].role = 1;
    users[13].role = 1;
    users[14].products = products.slice(0,25);
    users[13].products = products.slice(25,50);

    await entityManager.save(users);
    await entityManager.save(Category, [
      { id: 1, name: 'Vegetables', slug: 'vegetables', products: products.slice(0, 10)},
      { id: 2, name: 'Fruits', slug: 'fruits', products: products.slice(10, 20)},
      { id: 3, name: 'Dairy Products', slug: 'dairy-products', products: products.slice(20, 30)},
      { id: 4, name: 'Breeding', slug: 'breeding', products: products.slice(30, 40)},
      { id: 5, name: 'Meat', slug: 'meat', products: products.slice(40, 50)}
    ]);
  }
}
