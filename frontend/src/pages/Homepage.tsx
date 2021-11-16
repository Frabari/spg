import NavigationBox from './Navigation';
import { Container, Grid, Typography } from '@mui/material';
import { ReactComponent as ImageHome } from './images/image-home.svg';
import { useContext } from 'react';
import { UserContext } from '../contexts/user';
import { Navigate } from 'react-router-dom';

export default function Homepage() {
  const { user } = useContext(UserContext);

  return user === null ? null : user === false ? (
    <>
      <NavigationBox.NavBar loggedIn={0} />
      <Container>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyItems="center"
          spacing={3}
          paddingTop="10rem"
        >
          <Grid item xs={12}>
            <ImageHome width="300" height="400" />
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign="center" variant="h6">
              The solidarity purchase
            </Typography>
            <Typography textAlign="center" variant="h6">
              group at your fingertips
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  ) : (
    <Navigate to="/products" />
  );
}
