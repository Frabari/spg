import * as faker from 'faker/locale/it';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Category } from '../../features/categories/entities/category.entity';
import { Product } from '../../features/products/entities/product.entity';
import { User } from '../../features/users/entities/user.entity';
import { Role } from '../../features/users/roles.enum';
import { passwordTest } from '../constants';

const avatars = [
  'https://images.unsplash.com/photo-1597233709017-e4a73325d37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MXwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1600481176431-47ad2ab2745d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MnwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258M3wzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1549351236-caca0f174515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NHwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1560787313-5dff3307e257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NXwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NnwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1599589312087-9aaa2d6e37d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258N3wzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1593529467220-9d721ceb9a78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OHwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OXwzMjMzODM4Mnx8fHx8Mnx8MTYzNjY1MTE1Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTB8MzIzMzgzODJ8fHx8fDJ8fDE2MzY2NTExNTM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTF8MzIzMzgzODJ8fHx8fDJ8fDE2MzY2NTExNTM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1541647376583-8934aaf3448a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTJ8MzIzMzgzODJ8fHx8fDJ8fDE2MzY2NTExNTM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTN8MzIzMzgzODJ8fHx8fDJ8fDE2MzY2NTExNTM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTR8MzIzMzgzODJ8fHx8fDJ8fDE2MzY2NTExNTM&ixlib=rb-1.2.1&q=80&w=1080',
];

const regions = [
  'Abbruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  `Valle d'Aosta`,
  'Veneto',
];

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default class DbSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const entityManager = connection.createEntityManager();
    const products = await entityManager.save(
      await factory(Product)().createMany(50),
    );

    let i = 0;

    for (const role of Object.values(Role)) {
      for (const n of [1, 2]) {
        const name = faker.name.firstName();
        const surname = faker.name.lastName();
        await entityManager.save(User, {
          role: role,
          email: `${role}${n}@example.com`,
          name: name,
          surname: surname,
          password: passwordTest,
          products: checkFarmer(role, n, products),
          avatar: avatars[i++ % avatars.length],
          address: {
            name: name,
            surname: surname,
            address: faker.address.streetAddress(),
            city: faker.address.state(),
            zipCode: faker.address.zipCode(),
            province: faker.address.stateAbbr(),
            region: regions[getRandomInt(20)],
          },
        });
      }
    }
    await entityManager.save(Category, [
      {
        name: 'Vegetables',
        slug: 'vegetables',
        products: products.filter(
          p =>
            p.name === 'Onions Borettana' ||
            p.name === 'Chilli Peppers' ||
            p.name === 'Hardneck Garlics' ||
            p.name === 'Tomatoes' ||
            p.name === 'White Radishes' ||
            p.name === 'Gherkins' ||
            p.name === 'Red Potatoes' ||
            p.name === 'Grape Tomatoes' ||
            p.name === 'Dill Pickles' ||
            p.name === 'Beets' ||
            p.name === 'Ciliegino Tomatoes' ||
            p.name === 'Lemons' ||
            p.name === 'Graffiti Eggplants' ||
            p.name === 'Calabrese Broccoli' ||
            p.name === 'Pumpkins' ||
            p.name === 'Broccolini' ||
            p.name === 'Green Squashes' ||
            p.name === 'Beefsteak Tomatoes' ||
            p.name === 'Red Radishes',
        ),
      },
      {
        name: 'Fruits',
        slug: 'fruits',
        products: products.filter(
          p =>
            p.name === 'Daytona Watermelons' ||
            p.name === 'Green Kiwis' ||
            p.name === 'Aroma Strawberries' ||
            p.name === 'Nectarines' ||
            p.name === 'Asahi Miyako Watermelons' ||
            p.name === 'Golden Kiwis' ||
            p.name === 'Cavendish Bananas' ||
            p.name === 'Gooseberries' ||
            p.name === 'Mangos' ||
            p.name === 'Clementine Tangerines' ||
            p.name === 'Albion Strawberries' ||
            p.name === 'Peaches' ||
            p.name === 'Raspberries' ||
            p.name === 'Red Currants' ||
            p.name === 'White Melon' ||
            p.name === 'Red Pomegranates' ||
            p.name === 'Pears' ||
            p.name === 'Velvet Pomegranates' ||
            p.name === 'White Grapes',
        ),
      },
      {
        name: 'Dried Fruits',
        slug: 'dried-fruits',
        products: products.filter(
          p =>
            p.name === 'Shelled Walnuts' ||
            p.name === 'Shelled Almonds' ||
            p.name === 'Walnuts' ||
            p.name === 'Cashews' ||
            p.name === 'Pistachios',
        ),
      },
      {
        name: 'Breeding',
        slug: 'breeding',
        products: products.filter(
          p => p.name === 'Eggs' || p.name === 'Quail Eggs',
        ),
      },
      {
        name: 'Legumes',
        slug: 'legumes',
        products: products.filter(
          p =>
            p.name === 'Shelled Peas' ||
            p.name === 'Green Peas Pods' ||
            p.name === 'Fayot Beans',
        ),
      },
      {
        name: 'Wheat',
        slug: 'wheat',
        products: products.filter(
          p => p.name === 'Wheat' || p.name === 'Corns',
        ),
      },
    ]);
  }
}
