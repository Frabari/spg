import NavigationBox from './Navigation';
import { Container, Grid, Typography } from '@mui/material';
import { ReactComponent as ImageHome } from './images/image-home.svg';

export default function Homepage() {
  return (
    <>
      <NavigationBox.NavBar loggedIn={0} />
      <Container>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyItems="center"
          spacing={3}
          paddingTop="2rem"
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
  );
}
