import {
  Notification,
  Order,
  Product,
  ProductId,
  Transaction,
  User,
  UserId,
} from '../api/BasilApi';

let mockOrder: Partial<Order> = {
  id: 30,
  deliveryLocation: {
    city: 'Turin',
  },
};
let mockUser: Partial<User> = {
  id: 30,
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@rossi.com',
  password: 'mariorossi',
  notifications: [
    {
      id: 1,
      title: 'notification',
    } as Notification,
  ],
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
const mockOrders = [
  {
    id: 1,
    user: mockUser as User,
  },
];
let mockProduct: Partial<Product> = {
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
      mockOrder = { ...mockOrder, ..._order };
      return Promise.resolve(mockOrder);
    },
    updateOrder: (_id: number, _order: Partial<Order>) => {
      mockOrder = { ...mockOrder, ..._order };
      return Promise.resolve(mockOrder);
    },
    getOrder: (_id: number) => Promise.resolve(mockOrder),
    getOrders: () => Promise.resolve(mockOrders),
    getUser: (id?: UserId) => Promise.resolve({ ...mockUser, id }),
    getMe: () => Promise.resolve(mockUser),
    updateMe: (_user: Partial<User>) => {
      mockUser = {
        ...mockUser,
        ..._user,
      };
      return Promise.resolve(mockUser);
    },
    createUser: (_user: Partial<User>) => Promise.resolve(_user),
    updateUser: (_user: Partial<User>) => {
      mockUser = { ...mockUser, ..._user };
      return Promise.resolve(mockUser);
    },
    getUsers: () => Promise.resolve(mockUsers),
    getProduct: (id?: ProductId) => Promise.resolve(mockProduct),
    createProduct: (_product: Partial<Product>) => {
      mockProduct = { ...mockProduct, ..._product };
      return Promise.resolve(mockProduct);
    },
    updateProduct: (_id: number, _product: Partial<Product>) => {
      mockProduct = { ...mockProduct, ..._product };
      return Promise.resolve(mockProduct);
    },
    getProducts: () => Promise.resolve(mockProducts),
    getCategories: () => Promise.resolve(mockCategories),
    createTransaction: (_transaction: Partial<Transaction>) =>
      Promise.resolve(_transaction),
    getBasket: () => Promise.resolve(mockBasket),
    updateBasket(_basket: Partial<Order>) {
      mockBasket = { ...mockBasket, ..._basket };
      return Promise.resolve(mockBasket);
    },
    upsertEntry(_product: Product, _quantity: number) {
      return Promise.resolve(mockBasket);
    },
    deleteEntry(_product: Product) {
      return Promise.resolve(mockBasket);
    },
  };
});
