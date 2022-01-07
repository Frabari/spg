import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Typography } from '@mui/material';
import NavigationBox from './Navigation';
import { ReactComponent as ImageHome } from './images/image-home.svg';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <NavigationBox.NavBar />
      <Container>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyItems="center"
          spacing={3}
          marginTop="6rem"
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
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/products')}>
              {/* TODO replace with href */}
              Take a look to our products!
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
