import * as React from 'react';
import {Link, Navigate} from 'react-router-dom';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import Person from '@mui/icons-material/Person';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import {Logo} from '../components/Logo';
import {getMe, logout} from '../api/basil-api';
import {useContext} from 'react';
import {PendingStateContext} from '../contexts/pending';
import toast from 'react-hot-toast';
import {ApiException} from '../api/createHttpClient';
import {UserContext} from '../contexts/user';

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
        <Toolbar
            sx={{width: '100%', minHeight: '0!important', px: '0!important'}}
        >
            <Tabs value={value} onChange={handleChange}>
                <LinkTab label="Fruits" href="/fruits"/>
                <LinkTab label="Vegetables" href="/vegetables"/>
            </Tabs>
        </Toolbar>
    );
}

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f7f7f7',
    '&:hover': {
        backgroundColor: '#f7f7f7',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function NavBar(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {user, setUser} = useContext(UserContext);
    const {setPending} = useContext(PendingStateContext);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setPending(true);
            getMe()
                .then(setUser)
                .catch(() => setUser(false))
                .finally(() => setPending(false));
        } catch (e) {
            toast.error((e as ApiException).message);
        }
    };

    if (!user) {
        return <Navigate to="/"/>;
    }
    return (
        <AppBar position="fixed" sx={{borderBottom: '1px solid #f3f4f6'}}>
            <Container>
                <Toolbar sx={{px: '0!important'}}>
                    <IconButton href={'/'}>
                        <Logo/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ml: 1, mr: 'auto'}}>
                        Basil
                    </Typography>
                    {props.loggedIn === 0 ? (
                        <Box sx={{position: 'absolute', right: 0}}>
                            <Button component={Link} to={'/login'} sx={{px: 3, marginRight: '16px'}}>
                                Login
                            </Button>
                            <Button component={Link} to={'/signup'} variant="contained" sx={{px: 3}}>
                                Sign Up
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon style={{color: '#737373'}}/>
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{'aria-label': 'search'}}
                                    />
                                </Search>
                            </Box>

                            <Box sx={{display: {md: 'flex'}, ml: 'auto'}}>
                                <IconButton size="large" onClick={handleMenu}>
                                    <Avatar src={props.user.avatar}/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon/> Logout
                                    </MenuItem>
                                </Menu>
                                <IconButton size="large" aria-label="show cart">
                                    <Badge badgeContent={4}>
                                        <ShoppingCart/>
                                    </Badge>
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Toolbar>
                {props.products && <NavTabs/>}
            </Container>
        </AppBar>
    );
}

const NavigationBox = {NavTabs, NavBar};
export default NavigationBox;
