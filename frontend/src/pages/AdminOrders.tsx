import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, TableSortLabel, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Add, Pending } from '@mui/icons-material';
import { useOrders } from '../hooks/useOrders';
import { AdminAppBar } from '../components/AdminAppBar';
import { Order } from '../api/basil-api';
import DraftsIcon from '@mui/icons-material/Drafts';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';

const statusColor = {
  draft: {
    color: '#ddf208',
    icon: <DraftsIcon style={{ color: '#ddf208' }} />,
  },
  paid: { color: 'secondary', icon: <AttachMoneyIcon /> },
  delivering: {
    color: 'red',
    icon: <DeliveryDiningIcon style={{ color: 'red' }} />,
  },
  completed: { color: 'success', icon: <DoneIcon /> },
  pending_cancellation: { color: 'info', icon: <Pending /> },
  canceled: { color: 'warning', icon: <DeleteIcon /> },
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

export const AdminOrders = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { orders, error } = useOrders();
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
                    {' '}
                    <Chip
                      icon={statusColor.draft.icon}
                      variant="outlined"
                      label="delivering"
                      sx={{
                        borderColor: statusColor.draft.color,
                        color: statusColor.draft.color,
                      }}
                    />
                  </TableCell>
                  <TableCell>{order.entries.length}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
