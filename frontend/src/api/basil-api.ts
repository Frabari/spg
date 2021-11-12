import { createHttpClient } from '../../lib/createHttpClient';

export type CategoryId = number;

export interface Category {
  id: CategoryId;
  products: Product[];
  name: string;
  slug: string;
}

export type OrderEntryId = number;

export interface OrderEntry {
  id: OrderEntryId;
  order: Order;
  product: Product;
  quantity: number;
  confirmed: boolean;
}

export type OrderId = number;

export interface Order {
  id: OrderId;
  user: User;
  status: number;
  entries: OrderEntry[];
  deliverAt: Date;
  deliveryLocation: string;
  deliveredBy: User;
  createAt: Date;
}

export type ProductId = number;

export interface Product {
  id: ProductId;
  public: boolean;
  name: string;
  description: string;
  price: number;
  available: number;
  reserved: number;
  sold: number;
  category: Category;
  farmer: User;
}

export type TransactionId = number;

export interface Transaction {
  id: TransactionId;
  user: User;
  amount: number;
  createdAt: Date;
}

export type UserId = number;

export interface User {
  id: UserId;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: number;
  balance: number;
  orders: Order[];
  transactions: Transaction[];
  deliveries: Order[];
  products: Product[];
}

const client = createHttpClient('/api');

export interface Tokens {
  token: string;
}

export const login = (username: string, password: string) =>
  (<Promise<Tokens>>client.post('/users/login', {
    username,
    password,
  })).then(tokens => {
    client.setBearerAuth(tokens.token);
    return tokens;
  });

export const logout = () => {
  client.removeAuth();
};

export const getUsers = () => client.get<User[]>('/users');

export const getUser = (id: UserId) => client.get<User>(`/users/${id}`);

export const getMe = () => client.get<User>('/users/me');

export const createUser = (user: Partial<User>) =>
  client.post<User>('/users', user);

export const getProducts = () => client.get<Product[]>('/products');

export const getProduct = (id: ProductId) =>
  client.get<Product>(`/products/${id}`);

export const getCategories = () => client.get<Category[]>('/categories');
