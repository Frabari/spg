import * as React from 'react';
import {Box,Tabs, Tab, AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Button} from '@mui/material';
import Person from '@mui/icons-material/Person';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

interface LinkTabProps {
    label?: string;
    href?: string;
}
  
function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}
  
function NavTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        <LinkTab label="Fruits" href="/fruits" />
        <LinkTab label="Vegetables" href="/vegetables" />
      </Tabs>
    </Box>
  );
}

function NavBar(props: any) {

  const loggedIn=1;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary" >
        <Toolbar>
          <Avatar src="https://i.imgur.com/ZAxxEpG.png" />
          <Typography variant="h6" component="div" marginLeft="10px">
            Basil
          </Typography>
          {loggedIn ? <>
          <Box sx={{ flexGrow: 1 }} />
          <Button>Login</Button></>
          : 
          <>
          <Box sx={{ flexGrow: 1 }}>
            <SearchIcon />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" color="inherit" >
                <Person />
            </IconButton>
            <IconButton size="large" aria-label="show cart" color="inherit">
              <Badge badgeContent={4} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
          </>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const NavigationBox = { NavTabs, NavBar };
export default NavigationBox;
  