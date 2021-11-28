import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  Container,
  Chip,
  Grid,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBasket } from '../hooks/useBasket';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function ProductInfo(props: any) {
  const [counter, setCounter] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state.product;
  const farmer = product.farmer;
  const { basket, upsertEntry } = useBasket();
  let quantity = [];

  for (let i = 1; i <= product.available; i++) {
    quantity.push(i);
  }

  const style = {
    width: '90%',
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
    upsertEntry(product, counter).then(o => {
      toast.success(`${product.name} succesfully added!`);
      navigate('/products');
    });
  };

  return (
    <Container sx={{ my: 18 }}>
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
              <Grid item xs={1}>
                <IconButton onClick={() => navigate('/products')}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <Typography
                  align="right"
                  gutterBottom
                  variant="h6"
                  component="div"
                >
                  {'Product by ' + farmer.name + ' ' + farmer.surname}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Avatar src={farmer.avatar} sx={{ boxShadow: 2, right: 0 }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
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
                          label={`${product?.available} ${product.unitOfMeasure} left!`}
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
                      pr={8}
                    >
                      {product.description === 'description'
                        ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                        : product.description}
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
                      /{product.unitOfMeasure}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      spacing={2}
                      justifyItems="center"
                      alignItems="center"
                    >
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-select-quantity"
                          select
                          label="Quantity"
                          value={counter}
                          onChange={e => handleChange(parseInt(e.target.value))}
                          helperText="Select the desired quantity"
                        >
                          {quantity.map(option => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={8} mb={5}>
                        <Button onClick={() => handleClick()}>
                          Add to basket
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
