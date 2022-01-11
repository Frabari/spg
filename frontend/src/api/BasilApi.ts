import SocketIo from 'socket.io-client';
import { DateTime } from 'luxon';
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
  status?: string;
  id?: OrderEntryId;
  product: Product;
  quantity: number;
  orderId?: OrderId;
  productId?: ProductId;
}

export type OrderId = number;

export enum OrderStatus {
  DRAFT = 'draft',
  LOCKED = 'locked',
  PAID = 'paid',
  PENDING_PAYMENT = 'pending_payment',
  PREPARED = 'prepared',
  DELIVERING = 'delivering',
  UNRETRIEVED = 'unretrieved',
  COMPLETED = 'completed',
  PENDING_CANCELLATION = 'pending_cancellation',
  CANCELED = 'canceled',
}

export enum OrderEntryStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
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
  name: string;
  description: string;
  price: number;
  baseUnit: string;
  available: number;
  category: Category;
  farmer: User;
  image: string;
}

export interface StockItem extends Product {
  public: boolean;
  orderEntries: OrderEntry[];
  reserved: number;
  sold: number;
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

export const ADMINS = [
  Role.MANAGER,
  Role.WAREHOUSE_MANAGER,
  Role.WAREHOUSE_WORKER,
  Role.EMPLOYEE,
];

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
  companyName: string;
  companyImage: string;
  telegramToken: string;
  phoneNumber: string;
  blockedAt?: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  userId: UserId;
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
  return Promise.resolve();
};

/**
 * Users
 */

export const getFarmers = () => client.get<User[]>('/users/farmers');

export const getUsers = () => client.get<User[]>('/users');

export const getUser = (id: UserId) => client.get<User>(`/users/${id}`);

export const getMe = () => client.get<User>('/users/me');

export const updateMe = (profile: Partial<User>) =>
  client.patch<User>('/users/me', profile);

export const createUser = (user: Partial<User>) =>
  client.post<User>('/users', user);

export const updateUser = (id: UserId, user: Partial<User>) =>
  client.patch<User>(`/users/${id}`, user);

/**
 * Products
 */

export const getProducts = () => client.get<Product[]>('/products');

export const getProduct = (id: ProductId) =>
  client.get<Product>(`/products/${id}`);

/**
 * Stock
 */

export const getStock = () => client.get<StockItem[]>('/products/stock');

export const getStockItem = (id: ProductId) =>
  client.get<StockItem>(`/products/stock/${id}`);

export const createStockItem = (product: Partial<StockItem>) =>
  client.post<StockItem>('/products/stock', product);

export const updateStockItem = (id: ProductId, product: Partial<StockItem>) =>
  client.patch<StockItem>(`/products/stock/${id}`, product);

export const updateProductOrderEntries = (
  productId: ProductId,
  dto: Partial<OrderEntry>,
) => client.patch<OrderEntry[]>(`/products/${productId}/order-entries`, dto);

/**
 * Categories
 */

export const getCategories = () => client.get<Category[]>('/categories');

/**
 * Orders
 */

export const getOrders = () => client.get<Order[]>('/orders');

export const getOrder = (id: OrderId) => client.get<Order>(`/orders/${id}`);

export const createOrder = (order: Partial<Order>) =>
  client.post<Order>('/orders', order);

export const updateOrder = (id: OrderId, order: Partial<Order>) =>
  client.patch<Order>(`/orders/${id}`, order);

export const getBasket = () => client.get<Order>('/orders/basket');

export const updateBasket = (basket: Partial<Order>) =>
  client.patch<Order>('/orders/basket', basket);

/**
 * Transactions
 */

export const createTransaction = (transaction: Partial<Transaction>) =>
  client.post<Transaction>('/transactions', transaction);

/**
 * Scheduling
 */

export const getDate = () =>
  client
    .get<{ date: string }>('/scheduling/date')
    .then(r => DateTime.fromISO(r.date));

export const setDate = (date: DateTime) =>
  client
    .patch<{ date: string }>('/scheduling/date', { date: date.toISO() })
    .then(r => DateTime.fromISO(r.date));
