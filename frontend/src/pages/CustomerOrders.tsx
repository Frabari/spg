import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
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
import { Order, User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { orderStatuses } from '../constants';
import { useOrders } from '../hooks/useOrders';
import { useProfile } from '../hooks/useProfile';
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

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const CustomerOrders = (props: {
  handleDrawerToggle: () => void;
  status: string;
  week: string;
  delivery: string;
}) => {
  const navigate = useNavigate();
  let { data: orders } = useOrders();
  const { data: profile } = useProfile();
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<{
    by: keyof Order;
    dir: 'asc' | 'desc';
    value?: (o: Order) => any;
  }>({ by: null, dir: 'asc' });
  var data = new Date();

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

  // week column filter
  const [weekAnchorEl, weekSetAnchorEl] = useState<null | HTMLElement>(null);
  const openWeek = Boolean(weekAnchorEl);
  const weekHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    weekSetAnchorEl(event.currentTarget);
  };
  const weekHandleClose = () => {
    weekSetAnchorEl(null);
  };

  useEffect(() => {
    const ord = orders?.filter(o => o.user.id === (profile as User).id);
    orders = ord;
  }, [orders]);

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
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      status: s,
    });
    statusHandleClose();
  };

  const handleFilterByWeek = (s: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      week: s,
    });
    weekHandleClose();
  };

  const handleFilterByDelivery = (s: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      delivery: s,
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
                                  onClick={() => handleFilterByStatus(option)}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        ) : c.key === 'createdAt' ? (
                          <>
                            <IconButton onClick={weekHandleClick}>
                              <FilterAltIcon />
                            </IconButton>
                            <Menu
                              id="week-menu"
                              anchorEl={weekAnchorEl}
                              open={openWeek}
                              onClose={weekHandleClose}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                            >
                              {week.map(option => (
                                <MenuItem
                                  key={option}
                                  value={option}
                                  onClick={() => handleFilterByWeek(option)}
                                >
                                  {option}
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
                                onClick={() => handleFilterByDelivery('all')}
                              >
                                all
                              </MenuItem>
                              <MenuItem
                                key={DeliveryOption.PICKUP}
                                value={DeliveryOption.PICKUP}
                                onClick={() =>
                                  handleFilterByDelivery(DeliveryOption.PICKUP)
                                }
                              >
                                {DeliveryOption.PICKUP}
                              </MenuItem>
                              <MenuItem
                                key={DeliveryOption.DELIVERY}
                                value={DeliveryOption.DELIVERY}
                                onClick={() =>
                                  handleFilterByDelivery(
                                    DeliveryOption.DELIVERY,
                                  )
                                }
                              >
                                {DeliveryOption.DELIVERY}
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
                    searchParams.get('week') === 'all' ||
                    searchParams.get('week') === null ||
                    searchParams.get('week') === 'null' ||
                    (searchParams.get('week') === 'thisWeek' &&
                      new Date(order.createdAt).getDay() <= data.getDay() &&
                      dateDiffInDays(data, new Date(order.createdAt)) < 7) ||
                    (searchParams.get('week') === 'pastWeek' &&
                      new Date(order.createdAt).getDay() <= data.getDay() &&
                      dateDiffInDays(data, new Date(order.createdAt)) >= 7 &&
                      dateDiffInDays(data, new Date(order.createdAt)) < 14),
                )
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
                      onClick={() => navigate(`/account/orders/${order.id}`)}
                    >
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
