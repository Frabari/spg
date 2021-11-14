import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Save } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { AdminAppBar } from '../components/AdminAppBar';
import { Order, OrderStatus, Product, User } from '../api/basil-api';
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
        const creating = id == null;
        toast.success(`Order ${creating ? 'created' : 'updated'}`);
        if (creating) {
          navigate(`/admin/orders/${(newOrder as Order).id}`);
        }
      })
      .catch(e => {
        toast.error(e.message);
      });
  };

  const onProductSelected = (product: Product) => {
    setSelectingProduct(false);
    setDto(oldDto => {
      const entry = oldDto?.entries?.find(e => e.product.id === product.id);
      if (entry?.quantity >= product.available) {
        toast.error(
          `You have alredy selected maximum available quantiy for ${product.name}.`,
        );
        return { ...oldDto };
      }
      if (entry) {
        ++entry.quantity;
        return { ...oldDto };
      }
      return {
        ...oldDto,
        entries: oldDto?.entries?.concat({
          product,
          quantity: 1,
        }) ?? [{ product, quantity: 1 }],
      };
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
        <Paper sx={{ py: { xs: 2, sm: 4 } }}>
          <Container>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Main options
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item>
                <FormControl sx={{ width: 250 }}>
                  <InputLabel id="order-user">User</InputLabel>
                  <Select
                    labelId="order-user"
                    label="User"
                    required
                    value={users?.length ? dto?.user?.id : ''}
                    onChange={e =>
                      setDto(oldDto => ({
                        ...oldDto,
                        user: { id: +e.target.value } as User,
                      }))
                    }
                  >
                    <MenuItem value="">Select a user</MenuItem>
                    {users?.map(u => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name} {u.surname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl sx={{ width: 250 }}>
                  <InputLabel id="order-status">Status</InputLabel>
                  <Select
                    labelId="order-status"
                    label="Status"
                    value={id == null ? 'draft' : dto?.status ?? ''}
                    disabled={id == null}
                    onChange={e =>
                      setDto(oldDto => ({
                        ...oldDto,
                        status: e.target.value as OrderStatus,
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
              </Grid>
            </Grid>

            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
            >
              Products
            </Typography>
            <Divider />

            <List>
              {dto?.entries?.map(e => (
                <Fragment key={e.product.id}>
                  <ListItem>
                    <TextField
                      sx={{ width: '100px', mr: 2, pb: 0 }}
                      type="number"
                      size="small"
                      label="Quantity"
                      value={e.quantity ?? ''}
                      onChange={event => {
                        const value = +event.target.value;
                        if (value <= e.product.available) {
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
                        }
                      }}
                    />
                    <ListItemAvatar>
                      <Avatar src={e.product.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={e.product.name}
                      secondary={`€ ${e.product.price}/kg`}
                    />
                  </ListItem>
                  <Divider />
                </Fragment>
              ))}
            </List>
            <Button variant="text" onClick={() => setSelectingProduct(true)}>
              <Add />
              Add product
            </Button>

            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
            >
              Delivery/pickup
            </Typography>
            <Divider />
          </Container>
        </Paper>
      </Box>

      <Drawer
        anchor="right"
        open={selectingProduct}
        onClose={() => setSelectingProduct(false)}
      >
        <Box sx={{ width: { xs: '100%', sm: '60vw' } }}>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ p: 3, fontWeight: 'bold' }}
          >
            Select a product
          </Typography>
          <ProductsGrid onSelect={onProductSelected} />
        </Box>
      </Drawer>
    </>
  );
};
