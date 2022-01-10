import { Button, Container, Grid, Typography } from '@mui/material';
import NavigationBox from './Navigation';
import { ReactComponent as ImageHome } from './images/image-home.svg';

export default function Homepage() {
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
          <Grid item>
            <Typography textAlign="center" variant="h6" fontWeight="medium">
              The solidarity purchase
              <br />
              group at your fingertips
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" href="/products">
              Browse products
            </Button>
          </Grid>
          <Grid item>
            <ImageHome height="600" style={{ maxWidth: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
