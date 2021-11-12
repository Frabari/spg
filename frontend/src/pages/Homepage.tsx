import NavigationBox from './Navigation';
import { Typography, Container } from '@mui/material';
import { ReactComponent as ImageHome } from './images/image-home.svg';

export default function Homepage(props: any) {
  return (
    <>
      <NavigationBox.NavBar loggedIn={0} />
      <Container>
        <ImageHome width="400" height="500" />
        <Typography variant="h6">The solidarity purchase</Typography>
        <Typography variant="h6">group at your fingertips</Typography>
      </Container>
    </>
  );
}
