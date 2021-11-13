import NavigationBox from './Navigation';
import { Typography, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function ProductInfo(props: any) {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <NavigationBox.NavBar loggedIn={1} />
      <NavigationBox.NavTabs />

      <Grid container spacing={2} padding="30px">
        <Grid item xs={12} sm>
          <Img
            width="400"
            src="https://melinda.it/wp-content/uploads/2019/01/GOLDEN-DOP-bollino1.png"
          />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography
                align="left"
                gutterBottom
                variant="h4"
                component="div"
              >
                Product name
              </Typography>
              <Typography align="left" variant="body2" color="info">
                Product description
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="left"
                variant="subtitle1"
                component="div"
                display="inline"
              >
                € 1,30
              </Typography>
              <Typography align="left" variant="caption" color="text.secondary">
                /kg
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => setCounter(counter - 1)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <Typography variant="body2" display="inline">
                {counter}
              </Typography>
              <IconButton onClick={() => setCounter(counter + 1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Button
                style={{ maxWidth: '150px', borderRadius: 0 }}
                variant="contained"
              >
                Add to bag
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
