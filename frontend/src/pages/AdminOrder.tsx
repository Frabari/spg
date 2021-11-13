import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { AdminAppBar } from '../components/AdminAppBar';
import { Order, User } from '../api/basil-api';
import { useOrder } from '../hooks/useOrder';
import { useUsers } from '../hooks/useUsers';
import ProductsGrid from '../components/ProductsGrid';

export const AdminOrder = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { order, upsertOrder } = useOrder(id);
  const { users } = useUsers();
  const [dto, setDto] = useState<Partial<Order>>({});
  const [selectingProduct, setSelectingProduct] = useState(false);

  useEffect(() => {
    setDto(order);
  }, [order]);

  const saveChanges = () => {
    upsertOrder(dto)
      .then(newOrder => {
        toast.success(`Order ${order ? 'updated' : 'created'}`);
        navigate(`/admin/users/${(newOrder as Order).id}`);
      })
      .catch(e => {
        toast.error(e.message);
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
          Orders / {order ? order.id : 'New'}
        </Typography>
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          onClick={saveChanges}
        >
          <Save />
          <Typography
            sx={{
              display: { xs: 'none', sm: 'inline' },
              textTransform: 'none',
            }}
          >
            Save changes
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 2, sm: 3 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <Paper>
          <Container>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="order-user">User</InputLabel>
              <Select
                labelId="order-user"
                label="User"
                value={dto?.user?.id.toString() ?? ''}
                onChange={e =>
                  setDto(oldDto => ({
                    ...oldDto,
                    user: { id: +e.target.value } as User,
                  }))
                }
              >
                {users?.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} {u.surname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: 200 }}>
              <InputLabel id="order-status">Status</InputLabel>
              <Select
                labelId="order-status"
                label="Status"
                value={dto?.status ?? ''}
                onChange={e =>
                  setDto(oldDto => ({
                    ...oldDto,
                    status: e.target.value,
                  }))
                }
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="prepared">Prepared</MenuItem>
                <MenuItem value="delivering">Delivering</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending_cancellation">
                  Pending cancellation
                </MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>

            <Typography
              variant="h5"
              component="h2"
              sx={{ my: 4, fontWeight: 'bold' }}
            >
              Products
            </Typography>

            <List>
              {dto?.entries?.map(e => (
                <Fragment key={e.id ?? e.product.id}>
                  <Divider />
                  <ListItem>
                    <TextField
                      sx={{ width: '100px', mr: 2, pb: 0 }}
                      type="number"
                      size="small"
                      label="Quantity"
                      value={e.quantity}
                      onChange={event => {
                        const value = +event.target.value;
                        setDto(oldDto => {
                          let entries;
                          if (value === 0) {
                            entries = oldDto.entries.filter(oe => oe !== e);
                          } else {
                            entries = oldDto.entries.map(oe =>
                              oe !== e
                                ? oe
                                : {
                                    ...oe,
                                    quantity: +event.target.value,
                                  },
                            );
                          }
                          return {
                            ...oldDto,
                            entries,
                          };
                        });
                      }}
                    />
                    <ListItemText
                      primary={e.product.name}
                      secondary={`${e.product.price}€`}
                    />
                  </ListItem>
                </Fragment>
              ))}
            </List>
            <Button variant="text" onClick={() => setSelectingProduct(true)}>
              <Add />
              Add product
            </Button>
          </Container>
        </Paper>
      </Box>

      <Drawer
        anchor="right"
        open={selectingProduct}
        onClose={() => setSelectingProduct(false)}
        sx={{ width: { xs: '100%', sm: '60vw' } }}
      >
        <ProductsGrid />
      </Drawer>
    </>
  );
};
