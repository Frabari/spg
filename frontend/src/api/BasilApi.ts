import { createHttpClient } from './createHttpClient';

export type CategoryId = number;

export interface Category {
  id: CategoryId;
  products: Product[];
  name: string;
  slug: string;
}

export type OrderEntryId = number;

export interface OrderEntry {
  id?: OrderEntryId;
  product: Product;
  quantity: number;
  confirmed?: boolean;
}

export type OrderId = number;

export enum OrderStatus {
  DRAFT = 'draft',
  PAID = 'paid',
  PREPARED = 'prepared',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  PENDING_CANCELLATION = 'pending_cancellation',
  CANCELED = 'canceled',
}

export interface Order {
  id: OrderId;
  user: User;
  status: OrderStatus;
  entries: OrderEntry[];
  deliverAt: Date;
  deliveryLocation: string;
  deliveredBy: User;
  createdAt: Date;
  total: number;
  insufficientBalance: boolean;
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
  image: string;
  unitOfMeasure: string;
}

export type TransactionId = number;

export interface Transaction {
  id: TransactionId;
  user: User;
  amount: number;
  createdAt: Date;
}

export type UserId = number;

export enum Role {
  CUSTOMER = 'customer',
  FARMER = 'farmer',
  RIDER = 'rider',
  EMPLOYEE = 'employee',
  WAREHOUSE_WORKER = 'warehouse_worker',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  MANAGER = 'manager',
}

export interface User {
  id: UserId;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: Role;
  balance: number;
  avatar: string;
  orders: Order[];
  transactions: Transaction[];
  deliveries: Order[];
  products: Product[];
}

const client = createHttpClient('');

const token = localStorage.getItem('API_TOKEN');
if (token) {
  client.setBearerAuth(token);
}

export interface Tokens {
  token: string;
}

export const login = (username: string, password: string) =>
  client
    .post<Tokens>('/users/login', {
      username,
      password,
    })
    .then(tokens => {
      client.setBearerAuth(tokens.token);
      localStorage.setItem('API_TOKEN', tokens.token);
      return tokens;
    });

export const logout = () => {
  client.removeAuth();
  localStorage.removeItem('API_TOKEN');
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

export const getOrders = () => client.get<Order[]>('/orders');

export const getOrder = (id: OrderId) => client.get<Order>(`/orders/${id}`);

export const createOrder = (order: Partial<Order>) =>
  client.post<Order>('/orders', order);

export const updateOrder = (id: OrderId, order: Partial<Order>) =>
  client.patch<Order>(`/orders/${id}`, order);

export const createTransaction = (transaction: Partial<Transaction>) =>
  client.post<Transaction>('/transactions', transaction);

export const getBasket = () => client.get<Order>('/orders/basket');

export const updateBasket = (basket: Partial<Order>) =>
  client.patch<Order>('/orders/basket', basket);
