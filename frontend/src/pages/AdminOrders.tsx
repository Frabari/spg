import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add, Build, Pending } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DoneIcon from '@mui/icons-material/Done';
import DraftsIcon from '@mui/icons-material/Drafts';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  InputBase,
  styled,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Order, OrderStatus } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useOrders } from '../hooks/useOrders';

const status: Record<OrderStatus, { color: string; icon: any }> = {
  draft: {
    color: 'burlywood',
    icon: DraftsIcon,
  },
  paid: {
    color: 'darkorange',
    icon: AttachMoneyIcon,
  },
  delivering: {
    color: 'indigo',
    icon: DeliveryDiningIcon,
  },
  completed: { color: 'springgreen', icon: DoneIcon },
  pending_cancellation: { color: 'orangered', icon: Pending },
  canceled: { color: 'red', icon: DeleteIcon },
  prepared: { color: 'gold', icon: Build },
};

const columns: {
  key: keyof Order;
  title: string;
  sortable: boolean;
  value?: (order: Order) => any;
}[] = [
  {
    key: 'user',
    title: 'User',
    sortable: true,
    value: (i: Order) => i.user.email,
  },
  {
    key: 'status',
    title: 'Status',
    sortable: false,
  },
  {
    key: 'entries',
    title: 'Entries',
    sortable: true,
    value: (i: Order) => i.entries.length,
  },
  {
    key: 'createdAt',
    title: 'Created on',
    sortable: true,
  },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f7f7f7',
  '&:hover': {
    backgroundColor: '#f7f7f7',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const AdminOrders = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Order;
    dir: 'asc' | 'desc';
    value?: (o: Order) => any;
  }>({ by: null, dir: 'asc' });

  useEffect(() => {
    if (orders?.length) {
      const { by, dir, value } = sorting;
      if (by != null) {
        const mul = dir === 'asc' ? -1 : 1;
        const sorted = [...orders].sort((a, b) => {
          const _a = value ? value(a) : a[by];
          const _b = value ? value(b) : b[by];
          return _a < _b ? mul : -mul;
        });
        setSortedOrders(sorted);
      } else {
        setSortedOrders(orders);
      }
    }
  }, [orders, sorting]);

  const toggleSorting = (byKey: keyof Order) => () => {
    const { by, dir } = sorting;
    setSorting({
      by: by === byKey && dir === 'desc' ? null : byKey,
      dir: by == null ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
      value: columns.find(c => c.key === byKey)?.value,
    });
  };

  const handleChange = (value: any) => {
    setSortedOrders(
      orders.filter(
        o =>
          o.user.email
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          o.user.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          o.user.surname
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          o.status.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );
  };

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
        <Typography
          variant="h6"
          noWrap
          component="h1"
          color="primary.main"
          fontWeight="bold"
          sx={{ minWidth: '6rem', fontSize: { sm: 28 }, mr: 'auto' }}
        >
          Orders
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => handleChange(e.target.value)}
          />
        </Search>
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          href="/admin/orders/new"
        >
          <Add />
          <Typography
            sx={{
              display: { xs: 'none', sm: 'inline' },
              textTransform: 'none',
            }}
          >
            Create order
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 2, sm: 3 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <TableContainer
          component={Paper}
          sx={{ width: '100%', height: '100%' }}
        >
          <Table aria-label="Orders table" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(c => (
                  <TableCell
                    key={c.key}
                    sortDirection={sorting.by === c.key ? sorting.dir : false}
                  >
                    {c.sortable ? (
                      <TableSortLabel
                        active={sorting.by === c.key}
                        direction={sorting.by === c.key ? sorting.dir : 'asc'}
                        onClick={toggleSorting(c.key)}
                      >
                        {c.title}
                      </TableSortLabel>
                    ) : (
                      c.title
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders?.map(order => {
                const { icon: Icon, color } = status[order.status];
                return (
                  <TableRow
                    hover
                    key={order.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <TableCell component="th" scope="row">
                      {order.user.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          <Icon
                            sx={{
                              color: color + '!important',
                              width: 16,
                              height: 16,
                            }}
                          />
                        }
                        variant="outlined"
                        label={order.status}
                        sx={{
                          borderColor: color,
                          color: color,
                          py: '4px',
                          height: 'unset',
                        }}
                      />
                    </TableCell>
                    <TableCell>{order.entries.length}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
