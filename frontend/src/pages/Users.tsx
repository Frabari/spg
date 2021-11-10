import {
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  ListItemButton,
  TableContainer, Table, TableRow, TableHead, TableCell, Paper, Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { GridFooter } from '@mui/x-data-grid';

function Appbar(props: any) {
  return (
    <>
      <Grid xs={2}>
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Clients' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Products' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Orders' />
            </ListItemButton>
          </ListItem>
        </List>
        <Avatar sx={{ ml: 3 }}></Avatar>
      </Grid>
    </>
  );
}

function Users (props: any) {
  return (
    <>
      <Grid xs={10} sx={{ backgroundColor: '#fafafa', height: '100vh' }}>
        <h1 style={{ marginLeft: 25, color: '#5DD886' }}> Users </h1>
        <TableContainer component={Paper} sx={{ml: 5, mt: 5, maxWidth: 'inherit'}}>
          <Table sx={{ backgroundColor: 'white' }}>
            <TableHead>
              <TableRow>
                <TableCell> Email </TableCell>
                <TableCell> Surname </TableCell>
                <TableCell> City </TableCell>
                <TableCell> Gender </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}

function UsersPage (props: any) {
  return (
    <>
      <Grid container>
        <Appbar />
        <Users />
      </Grid>
      </>
  );
}

export default UsersPage;
