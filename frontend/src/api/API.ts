export interface Category {
  categoryId: number;
  products: Product[];
  name: string;
  slug: string;
}

export interface OrderEntry {
  orderentryId: number;
  order: Order;
  product: Product;
  quantity: number;
  confirmed: boolean;
}

export interface Order {
  orderId: number;
  user: User;
  status: number;
  entries: OrderEntry[];
  deliverAt: Date;
  deliveryLocation: string;
  deliveredBy: User;
  createAt: Date;
}

export interface Product {
  productId: number;
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

export interface Transaction {
  transactionId: number;
  user: User;
  amount: number;
  createdAt: Date;
}

export interface User {
    userId: number;
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

async function getUserInfo(userId: number) {
    const response = await fetch(`/users/${userId}`);
    const user = await response.json();
    if (response.ok) return user;
    else throw response.statusText;
}


const API = { getUserInfo};

export default API;