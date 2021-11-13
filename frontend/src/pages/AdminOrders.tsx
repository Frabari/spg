import { useNavigate } from 'react-router-dom';
import { Box, Button, TableSortLabel, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useOrders } from '../hooks/useOrders';
import { AdminAppBar } from '../components/AdminAppBar';
import { useEffect, useState } from 'react';
import { Order } from '../api/basil-api';
import { Add } from '@mui/icons-material';

const columns: { key: keyof Order; title: string; sortable: boolean }[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'surname',
    title: 'Surname',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    sortable: false,
  },
  {
    key: 'balance',
    title: 'Balance',
    sortable: true,
  },
];

export const AdminOrders = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { orders, error } = useOrders();
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Order;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });

  useEffect(() => {
    if (orders?.length) {
      const { by, dir } = sorting;
      if (by != null) {
        const mul = dir === 'asc' ? -1 : 1;
        const sorted = [...orders].sort((a, b) => (a[by] < b[by] ? mul : -mul));
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
    });
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
          sx={{ fontSize: { sm: 28 }, mr: 'auto' }}
        >
          Orders
        </Typography>
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
              {sortedOrders?.map(order => (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <TableCell component="th" scope="row">
                    {order.name}
                  </TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
