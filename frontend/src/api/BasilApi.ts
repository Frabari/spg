import SocketIo from 'socket.io-client';
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
}

export type OrderId = number;

export enum OrderStatus {
  DRAFT = 'draft',
  LOCKED = 'locked',
  PAID = 'paid',
  PENDING_PAYMENT = 'pending_payment',
  PREPARED = 'prepared',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  PENDING_CANCELLATION = 'pending_cancellation',
  CANCELED = 'canceled',
}

export interface DeliveryLocation {
  name?: string;
  surname?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  province?: string;
  region?: string;
}

export interface Order {
  id: OrderId;
  user: User;
  status: OrderStatus;
  entries: OrderEntry[];
  deliverAt: Date;
  deliveryLocation: DeliveryLocation;
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
  baseUnit: string;
  available: number;
  reserved: number;
  sold: number;
  category: Category;
  farmer: User;
  image: string;
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

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
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
  notifications: Notification[];
  address: DeliveryLocation;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
}

export type Constraints<T> = Record<keyof T, string>;

export const socket = SocketIo('http://localhost:3001', {
  transports: ['websocket'],
  query: { token: localStorage.getItem('API_TOKEN') },
});

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
      socket.io.opts.query.token = tokens.token;
      socket.disconnect().connect();
      client.setBearerAuth(tokens.token);
      localStorage.setItem('API_TOKEN', tokens.token);
      return tokens;
    });

export const logout = () => {
  client.removeAuth();
  socket.disconnect();
  localStorage.removeItem('API_TOKEN');
};

export const getUsers = () => client.get<User[]>('/users');

export const getUser = (id: UserId) => client.get<User>(`/users/${id}`);

export const getMe = () => client.get<User>('/users/me');

export const updateMe = (profile: Partial<User>) =>
  client.patch<User>('/users/me', profile);

export const createUser = (user: Partial<User>) =>
  client.post<User>('/users', user);

export const updateUser = (id: UserId, user: Partial<User>) =>
  client.patch<User>(`/users/${id}`, user);

export const getProducts = (loadAllStock = false) =>
  client.get<Product[]>(`/products${loadAllStock ? '?stock' : ''}`);

export const getProduct = (id: ProductId) =>
  client.get<Product>(`/products/${id}`);

export const createProduct = (product: Partial<Product>) =>
  client.post<Product>('/products', product);

export const updateProduct = (id: ProductId, product: Partial<Product>) =>
  client.patch<Product>(`/products/${id}`, product);

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

export const getDate = () => client.get<string>('scheduling/date');

export const setDate = (dto: { date: string }) =>
  client.patch<string>('scheduling/date', dto);
