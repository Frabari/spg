import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Product } from '../../features/products/entities/product.entity';
import { StockUnit } from '../../features/stock/entities/stock-unit.entity';

export default class DbSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const entityManager = connection.createEntityManager();
    const products = await factory(Product)().createMany(50);
    for (const product of products) {
      const su = await factory(StockUnit)().create();
      su.product = product;
      await entityManager.save(product);
      await entityManager.save(su);
    }
  }
}
