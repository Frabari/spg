import { Build, Clear, Lock, Pending } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DoneIcon from '@mui/icons-material/Done';
import DraftsIcon from '@mui/icons-material/Drafts';
import { OrderStatus } from './api/BasilApi';

export const drawerWidth = 240;
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
  unretrieved: {
    key: 'unretrieved',
    name: 'Unretrieved',
    color: 'chocolate',
    icon: Clear,
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
