import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Alert,
  Box,
  Button,
  Container,
  Chip,
  Grid,
  Stack,
  Collapse,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDate } from '../hooks/useDate';
import { useProduct } from '../hooks/useProduct';
import { useProfile } from '../hooks/useProfile';
import { useUpdateBasket } from '../hooks/useUpdateBasket';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export const ProductInfo = () => {
  const [counter, setCounter] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: product } = useProduct(+id);
  const { upsertEntry } = useUpdateBasket();
  const [ready, setReady] = useState(false);
  const { data: date } = useDate();

  useEffect(() => {
    if (product?.id) {
      setReady(true);
    }
  }, [ready, product]);

  const style = {
    bgcolor: 'background.paper',
    boxShadow: 1,
    borderRadius: '16px',
    marginInline: 'auto',
    justifySelf: 'center',
    alignSelf: 'center',
    p: 4,
  };

  const handleChange = (q: number) => {
    setCounter(q);
  };

  const handleClick = () => {
    const from = date.set({
      weekday: 6,
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const to = from.plus({ hour: 38 });

    if (date < from || date > to) {
      toast.error(
        `You can add products to the basket only from Saturday 9am to Sunday 23pm`,
      );
    } else {
      upsertEntry(product, counter).then(() => {
        toast.success(`${product.name} successfully added!`);
        navigate('/products');
      });
    }
  };

  const from = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const to = from.plus({ hour: 38 });

  const [open, setOpen] = useState(true);

  return (
    ready && (
      <Container sx={{ mt: 18, mb: 9 }}>
        {date < from || date > to ? (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Collapse in={open}>
              <Alert
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {' Products can be purchased from '}
                {'Saturday'} {from.day}
                {' (9:00 am)'}
                {' to '}
                {'Sunday'} {to.day}
                {' (11:00 pm)'}
              </Alert>
            </Collapse>
          </Stack>
        ) : (
          ''
        )}
        <Box sx={style}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justifyItems="center"
              >
                <Grid item xs={2} sm={1}>
                  <IconButton onClick={() => navigate('/products')}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={8} sm={10}>
                  <Typography
                    align="right"
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    {'Product by '}
                    <Typography
                      fontWeight="bold"
                      align="right"
                      gutterBottom
                      variant="h6"
                      component="div"
                      display="inline"
                    >
                      {product.farmer.name + ' ' + product.farmer.surname}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={1}>
                  <Avatar
                    src={product.farmer.avatar}
                    sx={{ boxShadow: 2, right: 0 }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
                justifyItems="center"
              >
                <Grid item xs={4}>
                  <Img width="800" src={product.image} />
                </Grid>
                <Grid item xs={8}>
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                    justifyItems="center"
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        justifyItems="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography
                            align="left"
                            gutterBottom
                            variant="h5"
                            fontSize={40}
                            component="div"
                          >
                            {product.name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Chip
                            sx={{
                              color: '#ffffff',
                              backgroundColor: '#5dd886',
                              marginBottom: '16px',
                              fontWeight: 'bold',
                              fontSize: 20,
                              py: 3,
                            }}
                            label={`${product?.available} left!`}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography
                        align="left"
                        variant="h5"
                        color="info"
                        textAlign="justify"
                        fontSize={20}
                        pr={{ xs: 2, md: 8 }}
                      >
                        {product.description}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        align="left"
                        variant="h5"
                        component="div"
                        display="inline"
                        fontWeight="bold"
                      >
                        € {product.price}
                      </Typography>
                      <Typography
                        align="left"
                        variant="h6"
                        color="text.secondary"
                        display="inline"
                        fontWeight="bold"
                      >
                        /{product.baseUnit}
                      </Typography>
                    </Grid>
                    <Grid item display={!profile && 'none'}>
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        justifyItems="center"
                        alignItems="center"
                      >
                        {date >= from && date <= to ? (
                          <>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                id="outlined-select-quantity"
                                select
                                label="Quantity"
                                value={counter}
                                onChange={e =>
                                  handleChange(parseInt(e.target.value))
                                }
                                helperText="Select the desired quantity"
                              >
                                {Array.from(
                                  { length: product.available },
                                  (v, k) => k + 1,
                                ).map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} sm={8} mb={5}>
                              <Button onClick={() => handleClick()}>
                                Add to basket
                              </Button>
                            </Grid>
                          </>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    )
  );
};
