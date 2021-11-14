import {ChangeEvent, MouseEvent, useContext, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {Link, Navigate} from 'react-router-dom';
import {getMe, login} from '../api/basil-api';
import {UserContext} from '../contexts/user';
import {PendingStateContext} from '../contexts/pending';
import {Logo} from '../components/Logo';
import {toast} from 'react-hot-toast';
import {ApiException} from '../api/createHttpClient';

interface State {
    password: string;
    showPassword: boolean;
}

function OutlinedCard(props: any) {
    const [values, setValues] = useState<State>({
        password: '',
        showPassword: false,
    });
    const [email, setEmail] = useState('');

    const handleChange =
        (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleEmail = (email: string) => {
        setEmail(email);
    };

    return (
        <Card variant="outlined" sx={{mx: 1}}>
            <CardContent
                sx={{
                    pb: 0,
                    p: 4,
                    px: {xs: 2, sm: 4},
                    maxWidth: 300,
                }}
            >
                <Box component="form" noValidate autoComplete="off">
                    <div>
                        <Typography
                            variant="h5"
                            color="primary.main"
                            sx={{mb: 2, fontWeight: 'bold'}}
                        >
                            Login
                        </Typography>
                        <Grid container rowSpacing={1} direction="column">
                            <Grid item>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    onChange={e => handleEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">
                                        Password
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleChange('password')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? (
                                                        <VisibilityOff/>
                                                    ) : (
                                                        <Visibility/>
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </CardContent>
            <CardActions>
                <Grid container direction="column" alignItems="center" justifyItems="center" paddingBottom="1rem">
                <Grid item sx={{p: 2, pt: 0}}>
                    <Button
                        variant="contained"
                        onClick={() => props.handleLogin(email, values.password)}
                        sx={{px: 3}}
                    >
                        Login
                    </Button>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body2"
                        display="inline"
                    >
                        {"Not registered? "}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="primary.main"
                        component={Link}
                        to="/signup"
                        display="inline"
                        sx={{textDecoration: 'none'}}
                    >
                        {"Sign up!"}
                    </Typography>
                </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}

export default function Login(props: any) {
    // const [logged, setLogged] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const {setPending} = useContext(PendingStateContext);

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
            setPending(true);
            getMe()
                .then(setUser)
                .catch(() => setUser(false))
                .finally(() => setPending(false));
        } catch (e) {
            toast.error((e as ApiException).message);
        }
    };

    if (user) {
        return <Navigate to="/products"/>;
    }
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{minHeight: '100vh', backgroundColor: '#fafafa'}}
        >
            <Grid item xs={4}>
                <Box sx={{flexGrow: 1}} style={{width: 'fit-content'}}>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="center"
                        marginBottom="2rem"
                    >
                        <Grid item>
                            <Logo/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" component="div" marginLeft="10px">
                                Basil
                            </Typography>
                        </Grid>
                    </Grid>
                    <OutlinedCard handleLogin={handleLogin}/>
                </Box>
            </Grid>
        </Grid>
    );
}
