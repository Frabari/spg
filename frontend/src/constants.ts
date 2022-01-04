import {
  AccountBox,
  Agriculture,
  Build,
  DeliveryDining,
  Inventory,
  Inventory2,
  Lock,
  Pending,
  Person,
} from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DoneIcon from '@mui/icons-material/Done';
import DraftsIcon from '@mui/icons-material/Drafts';
import { OrderStatus, Role } from './api/BasilApi';

export const drawerWidth = 240;
export const roles: Record<
  Role,
  { key: string; name: string; color: string; icon: any }
> = {
  customer: {
    color: 'yellowgreen',
    icon: AccountBox,
    key: 'customer',
    name: 'Customer',
  },
  employee: {
    color: 'slategray',
    icon: BadgeIcon,
    key: 'employee',
    name: 'Employee',
  },
  farmer: {
    color: 'forestgreen',
    icon: Agriculture,
    key: 'farmer',
    name: 'Farmer',
  },
  manager: { color: 'tomato', icon: Person, key: 'manager', name: 'Manager' },
  rider: {
    color: 'goldenrod',
    icon: DeliveryDining,
    key: 'rider',
    name: 'Rider',
  },
  warehouse_manager: {
    color: 'midnightblue',
    icon: Inventory2,
    key: 'warehouse_manager',
    name: 'Warehouse Manager',
  },
  warehouse_worker: {
    color: 'sienna',
    icon: Inventory,
    key: 'warehouse_worker',
    name: 'Warehouse Worker',
  },
};
export const orderStatuses: Record<
  OrderStatus,
  { key: string; name: string; color: string; icon: any }
> = {
  draft: {
    key: 'draft',
    name: 'Draft',
    color: 'burlywood',
    icon: DraftsIcon,
  },
  locked: {
    key: 'locked',
    name: 'Locked',
    color: 'grey',
    icon: Lock,
  },
  pending_payment: {
    key: 'pending_payment',
    name: 'Pending payment',
    color: 'red',
    icon: AttachMoneyIcon,
  },
  paid: {
    key: 'paid',
    name: 'Paid',
    color: 'darkorange',
    icon: AttachMoneyIcon,
  },
  prepared: {
    key: 'prepared',
    name: 'Prepared',
    color: 'gold',
    icon: Build,
  },
  delivering: {
    key: 'delivering',
    name: 'Delivering',
    color: 'indigo',
    icon: DeliveryDiningIcon,
  },
  completed: {
    key: 'completed',
    name: 'Completed',
    color: 'springgreen',
    icon: DoneIcon,
  },
  pending_cancellation: {
    key: 'pending_cancellation',
    name: 'Pending cancellation',
    color: 'orangered',
    icon: Pending,
  },
  canceled: {
    key: 'canceled',
    name: 'Canceled',
    color: 'red',
    icon: DeleteIcon,
  },
};
