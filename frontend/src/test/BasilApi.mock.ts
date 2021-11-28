import { Order, Product, ProductId, User } from '../api/BasilApi';

let mockOrder: Partial<Order> = {
  id: 30,
};
const mockUser: Partial<User> = {
  id: 30,
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@rossi.com',
  password: 'mariorossi',
};
const mockUsers = [
  {
    id: 30,
    name: 'Mario',
  },
  {
    id: 31,
    name: 'Luigi',
  },
];
const mockProduct: Partial<Product> = {
  id: 30,
  name: 'Apple',
};
const mockProducts = [
  {
    id: 40,
    name: 'Orange',
  },
  {
    id: 41,
    name: 'Banana',
  },
  {
    id: 42,
    name: 'Ananas',
  },
];
const mockCategories = [
  {
    id: 41,
    name: 'Vegetables',
  },
  {
    id: 42,
    name: 'Fruits',
  },
];
let mockBasket: Partial<Order> = {
  id: 1,
  user: mockUser as User,
  entries: [
    {
      id: 1,
      product: { id: 1 } as Product,
      quantity: 2,
    },
  ],
};

jest.mock('../api/BasilApi', () => {
  const originalModule = jest.requireActual('../api/BasilApi');
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createOrder: (_order: Partial<Order>) => {
      mockOrder = _order;
      return Promise.resolve(mockOrder);
    },
    updateOrder: (_id: number, _order: Partial<Order>) => {
      mockOrder = _order;
      return Promise.resolve(mockOrder);
    },
    getOrder: (_id: number) => Promise.resolve(mockOrder),
    getUser: () => Promise.resolve(mockUser),
    getMe: () => Promise.resolve(mockUser),
    createUser: (_user: Partial<User>) => Promise.resolve(_user),
    getUsers: () => Promise.resolve(mockUsers),
    getProduct: (id?: ProductId) => Promise.resolve(mockProduct),
    getProducts: () => Promise.resolve(mockProducts),
    getCategories: () => Promise.resolve(mockCategories),
    getBasket: () => Promise.resolve(mockBasket),
    updateBasket(_basket: Partial<Order>) {
      mockBasket = _basket;
      return Promise.resolve(mockBasket);
    },
  };
});
