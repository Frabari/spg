import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  styled,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Order } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { orderStatuses } from '../constants';
import { useOrders } from '../hooks/useOrders';
import { DeliveryOption } from './Checkout';

const statusFilters = [
  'all',
  'draft',
  'paid',
  'pending_payment',
  'delivering',
  'completed',
  'pending_cancellation',
  'canceled',
  'prepared',
];

const week = ['all', 'thisWeek', 'pastWeek'];

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
  {
    key: 'deliverAt',
    title: 'Deliver/Pick up at',
    sortable: true,
  },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
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

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const Orders = (props: {
  handleDrawerToggle: () => void;
  status: string;
  week: string;
  delivery: string;
}) => {
  const navigate = useNavigate();
  const { data: orders } = useOrders();
  const [orderStatus, setOrderStatus] = useState(props.status);
  const [weekFilter, setWeekFilter] = useState(props.week);
  const [deliveryFilter, setDeliveryFilter] = useState(props.delivery);
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Order;
    dir: 'asc' | 'desc';
    value?: (o: Order) => any;
  }>({ by: null, dir: 'asc' });
  var data = new Date();

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

  const handleFilterByStatus = (s: string) => {
    navigate(
      `/admin/orders?status=${s}&week=${weekFilter}&delivery=${deliveryFilter}`,
    );
    setOrderStatus(s);
  };

  const handleFilterByWeek = (s: string) => {
    navigate(
      `/admin/orders?week=${s}&status=${orderStatus}&delivery=${deliveryFilter}`,
    );
    setWeekFilter(s);
  };

  const handleFilterByDelivery = (s: string) => {
    navigate(`/admin/orders?delivery=${s}&week=${s}&status=${orderStatus}`);
    setDeliveryFilter(s);
  };

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
        <Search sx={{ mr: 'auto', maxWidth: '250px' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => handleChange(e.target.value)}
          />
        </Search>
        <IconButton
          sx={{ ml: 1, display: { xs: 'flex', md: 'none' } }}
          className="add-icon-button"
          href="/admin/orders/new"
        >
          <Add />
        </IconButton>
        <Button
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
          variant="contained"
          href="/admin/orders/new"
          startIcon={<Add />}
        >
          <Typography display="inline" sx={{ textTransform: 'none' }}>
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
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        {c.sortable ? (
                          <TableSortLabel
                            active={sorting.by === c.key}
                            direction={
                              sorting.by === c.key ? sorting.dir : 'asc'
                            }
                            onClick={toggleSorting(c.key)}
                          >
                            {c.title}
                          </TableSortLabel>
                        ) : (
                          c.title
                        )}
                      </Grid>
                      <Grid item>
                        {c.key === 'status' ? (
                          <TextField
                            id="outlined-select-role"
                            select
                            value={orderStatus}
                            size="small"
                            label="Filter by status"
                            sx={{ width: '175px' }}
                            onChange={e => handleFilterByStatus(e.target.value)}
                          >
                            {statusFilters.map(option => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : c.key === 'createdAt' ? (
                          <TextField
                            id="outlined-select-role"
                            select
                            value={weekFilter}
                            size="small"
                            label="Filter by week"
                            sx={{ width: '175px' }}
                            onChange={e => handleFilterByWeek(e.target.value)}
                          >
                            {week.map(option => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : c.key === 'deliverAt' ? (
                          <TextField
                            id="outlined-select-deliver"
                            select
                            value={deliveryFilter}
                            size="small"
                            label="Filter by delivery option"
                            sx={{ width: '175px' }}
                            onChange={e =>
                              handleFilterByDelivery(e.target.value)
                            }
                          >
                            <MenuItem key="all" value="all">
                              all
                            </MenuItem>
                            <MenuItem
                              key={DeliveryOption.PICKUP}
                              value={DeliveryOption.PICKUP}
                            >
                              {DeliveryOption.PICKUP}
                            </MenuItem>
                            <MenuItem
                              key={DeliveryOption.DELIVERY}
                              value={DeliveryOption.DELIVERY}
                            >
                              {DeliveryOption.DELIVERY}
                            </MenuItem>
                          </TextField>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders
                ?.filter(
                  order =>
                    weekFilter === 'all' ||
                    weekFilter === null ||
                    weekFilter === 'null' ||
                    (weekFilter === 'thisWeek' &&
                      new Date(order.createdAt).getDay() <= data.getDay() &&
                      dateDiffInDays(data, new Date(order.createdAt)) < 7) ||
                    (weekFilter === 'pastWeek' &&
                      new Date(order.createdAt).getDay() <= data.getDay() &&
                      dateDiffInDays(data, new Date(order.createdAt)) >= 7 &&
                      dateDiffInDays(data, new Date(order.createdAt)) < 14),
                )
                ?.filter(
                  order =>
                    orderStatus === 'all' ||
                    orderStatus === null ||
                    orderStatus === 'null' ||
                    order.status === orderStatus,
                )
                ?.filter(
                  order =>
                    deliveryFilter === null ||
                    deliveryFilter === 'all' ||
                    deliveryFilter === 'null' ||
                    (deliveryFilter === 'pickup' &&
                      order.deliveryLocation === null) ||
                    (deliveryFilter === 'delivery' &&
                      order.deliveryLocation !== null),
                )
                .map(order => {
                  const {
                    icon: Icon,
                    color,
                    name,
                  } = orderStatuses[order.status];
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
                          label={name}
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
                      <TableCell>
                        {`${new Date(
                          order.deliverAt,
                        ).toLocaleDateString()} - ${new Date(
                          order.deliverAt,
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`}
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
