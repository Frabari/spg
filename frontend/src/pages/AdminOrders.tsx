import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  styled,
  Tab,
  TableSortLabel,
  Tabs,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Order, OrderStatus } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { orderStatuses } from '../constants';
import { useDate } from '../hooks/useDate';
import { useOrders } from '../hooks/useOrders';
import { DeliveryOption } from './Checkout';

const statusFilters = [
  'all',
  'draft',
  'paid',
  'pending_payment',
  'delivering',
  'unretrieved',
  'completed',
  'pending_cancellation',
  'canceled',
  'prepared',
];

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const AdminOrders = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { data: orders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams({
    status: 'all',
    delivery: 'all',
  });
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Order;
    dir: 'asc' | 'desc';
    value?: (o: Order) => any;
  }>({ by: null, dir: 'asc' });
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // status column filter
  const [statusAnchorEl, statusSetAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const openStatus = Boolean(statusAnchorEl);
  const statusHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    statusSetAnchorEl(event.currentTarget);
  };
  const statusHandleClose = () => {
    statusSetAnchorEl(null);
  };

  // deliver column filter
  const [deliverAnchorEl, deliverSetAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const openDeliver = Boolean(deliverAnchorEl);
  const deliverHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    deliverSetAnchorEl(event.currentTarget);
  };
  const deliverHandleClose = () => {
    deliverSetAnchorEl(null);
  };

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

  const handleStatusSearchParams = (status: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      status: status,
    });
    statusHandleClose();
  };

  const handleDeliverySearchParams = (delivery: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      delivery: delivery,
    });
    deliverHandleClose();
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

  const { data: date } = useDate();

  const from = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const to = from.plus({ hour: 38 });

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
        {date >= from && date <= to ? (
          <>
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
          </>
        ) : (
          <Tooltip
            arrow
            title="This function is available from Saturday 9am to Sunday 23pm"
          >
            <div>
              <IconButton
                disabled
                sx={{
                  ml: 1,
                  display: { xs: 'flex', md: 'none' },
                  backgroundColor: 'rgb(220,220,220) !important',
                }}
                href="/admin/orders/new"
              >
                <Add />
              </IconButton>
              <Button
                sx={{
                  display: { xs: 'none', md: 'flex' },
                }}
                disabled
                variant="contained"
                href="/admin/orders/new"
                startIcon={<Add />}
              >
                <Typography display="inline" sx={{ textTransform: 'none' }}>
                  Create order
                </Typography>
              </Button>
            </div>
          </Tooltip>
        )}
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 1, sm: 2 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '16px' }}>
          <Tabs
            value={value}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
            variant="scrollable"
          >
            <Tab
              label="Show all"
              {...a11yProps(0)}
              onClick={() =>
                setSearchParams({
                  status: 'all',
                  delivery: 'all',
                })
              }
            />
            <Tab
              label="Show pick up schedule"
              {...a11yProps(1)}
              onClick={() =>
                setSearchParams({
                  status: OrderStatus.PAID,
                  delivery: DeliveryOption.PICKUP,
                })
              }
            />
            <Tab
              label="Show orders pending cancellation"
              {...a11yProps(2)}
              onClick={() =>
                setSearchParams({
                  status: OrderStatus.PENDING_PAYMENT,
                  delivery: 'all',
                })
              }
            />
            <Tab
              label="Show orders unretrieved"
              {...a11yProps(3)}
              onClick={() =>
                setSearchParams({
                  status: OrderStatus.UNRETRIEVED,
                  delivery: 'all',
                })
              }
            />
          </Tabs>
        </Box>

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
                    <Grid
                      container
                      direction="row"
                      spacing={1}
                      justifyItems="center"
                      alignItems="center"
                    >
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
                          <>
                            <IconButton onClick={statusHandleClick}>
                              <FilterAltIcon />
                            </IconButton>
                            <Menu
                              id="status-menu"
                              anchorEl={statusAnchorEl}
                              open={openStatus}
                              onClose={statusHandleClose}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                            >
                              {statusFilters.map(option => (
                                <MenuItem
                                  key={option}
                                  value={option}
                                  onClick={() =>
                                    handleStatusSearchParams(option)
                                  }
                                >
                                  {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        ) : c.key === 'deliverAt' ? (
                          <>
                            <IconButton onClick={deliverHandleClick}>
                              <FilterAltIcon />
                            </IconButton>
                            <Menu
                              id="deliver-menu"
                              anchorEl={deliverAnchorEl}
                              open={openDeliver}
                              onClose={deliverHandleClose}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                            >
                              <MenuItem
                                key="all"
                                value="all"
                                onClick={() =>
                                  handleDeliverySearchParams('all')
                                }
                              >
                                All
                              </MenuItem>
                              <MenuItem
                                key={DeliveryOption.PICKUP}
                                value={DeliveryOption.PICKUP}
                                onClick={() =>
                                  handleDeliverySearchParams(
                                    DeliveryOption.PICKUP,
                                  )
                                }
                              >
                                {DeliveryOption.PICKUP.charAt(0).toUpperCase() +
                                  DeliveryOption.PICKUP.slice(1)}
                              </MenuItem>
                              <MenuItem
                                key={DeliveryOption.DELIVERY}
                                value={DeliveryOption.DELIVERY}
                                onClick={() =>
                                  handleDeliverySearchParams(
                                    DeliveryOption.DELIVERY,
                                  )
                                }
                              >
                                {DeliveryOption.DELIVERY.charAt(
                                  0,
                                ).toUpperCase() +
                                  DeliveryOption.DELIVERY.slice(1)}
                              </MenuItem>
                            </Menu>
                          </>
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
                    searchParams.get('status') === 'all' ||
                    searchParams.get('status') === null ||
                    searchParams.get('status') === 'null' ||
                    order.status === searchParams.get('status'),
                )
                ?.filter(
                  order =>
                    searchParams.get('delivery') === null ||
                    searchParams.get('delivery') === 'all' ||
                    searchParams.get('delivery') === 'null' ||
                    (searchParams.get('delivery') === 'pickup' &&
                      order.deliveryLocation === null) ||
                    (searchParams.get('delivery') === 'delivery' &&
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
