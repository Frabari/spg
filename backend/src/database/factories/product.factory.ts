import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Product } from '../../features/products/entities/product.entity';

const images = [
  'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/flagged/photo-1579410137922-543ed48d263e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MnxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1573066778058-03dbee2c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258M3xJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1576561601677-ac33c580a70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NHxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1576561923295-844b45d669f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1581074817932-af423ba4566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NnxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258N3xJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OHxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587049693270-c7560da11218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587049668380-64cc7ede130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587131798251-0f02ebc5f473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587313170527-446f86d0c3d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587334106914-b90ecebe9845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587334274084-2def9f57bd27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587411768345-867e228218c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587411768515-eeac0647deed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486913042-5d9362101999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486912758-4367d2015d6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486913117-e1feab360f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486938113-d6d38d424efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486936739-78df7470c7e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587486937303-32eaa2134b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587492661070-6bc07c8c0fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1587735243475-46f39636076a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615484478073-001e0ebfd406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615484477915-040a4c70c0cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615484477201-9f4953340fab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615484476889-2830f980a5e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615484477863-ba177590e3e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485291234-9d694218aeb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485020845-601a6d2971a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485290885-c7273a06c79e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485290161-7eb49a34eba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485499978-1279c3d6302f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485500710-aa71300612aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485737651-580c9159c89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485737643-406ce5bac81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925873-7ecbbe90a866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925694-a03ef8fd9e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925933-379c8b6ad03c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925807-d11c291f531c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615485925763-86786288908a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615486171815-2611a6e3cd02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
  'https://images.unsplash.com/photo-1615486171756-90eed2c26961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NTB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
];

let i = 0;

define(Product, (faker: typeof Faker) => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.description = 'description';
  product.price = +faker.commerce.price(1, 50);
  product.available = faker.random.number(10);
  product.image = images[i++ % images.length];
  return product;
});
