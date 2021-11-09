import { Box, Grid, ListItem, ListItemIcon, ListItemText, List, ListItemButton, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';

function Appbar(props: any) {
  return(
    <>
    <Grid justifyContent='center' sx={{height: '100vh', width: 190, bgcolor: '#E5E5E5'}}>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{bgcolor: 'white'}}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Clients' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Products' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Orders' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Stock Units' />
          </ListItemButton>
        </ListItem>
      </List>
    </Grid>
    </>
  )
}

function Users (props: any) {

  const rows: any = [
    {
      id: 1,
      col1: 'Hello',
      col2: 'World',
      col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used.',
    },
    {
      id: 2,
      col1: 'DataGridPro',
      col2: 'is Awesome',
      col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
    },
    {
      id: 3,
      col1: 'MUI',
      col2: 'is Amazing',
      col3: 'Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
    },
    {
      id: 4,
      col1: 'Hello',
      col2: 'World',
      col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form.',
    },
    {
      id: 5,
      col1: 'DataGridPro',
      col2: 'is Awesome',
      col3: 'Typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
    },
    {
      id: 6,
      col1: 'MUI',
      col2: 'is Amazing',
      col3: 'Lorem ipsum may be used as a placeholder before final copy is available.',
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'surname',
      headerName: 'Surname',
      width: 150,
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 150,
    }
  ];
  return (
    <>
    <h1>
      Users
    </h1>
      <div>
    <DataGrid columns={columns} rows={rows}/>
      </div>
      </>
  )
}

function UsersPage (props: any) {
  return (
    <>
      <Appbar />
      <Users />
    </>
  )
}

export default Appbar;
