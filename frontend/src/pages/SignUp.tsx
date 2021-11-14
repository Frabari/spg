import {
    Avatar, Box, Button, createTheme,
    FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, ThemeProvider
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useState, MouseEvent, ChangeEvent} from "react";
import {Navigate, useNavigate} from "react-router";
import {User} from "../api/basil-api";
import {useUser} from "../hooks/useUser";
import toast from "react-hot-toast";

export default function SignUp(props: any) {
    const navigate = useNavigate();
    const [dto, setDto] = useState<Partial<User>>({});
    const {user, upsertUser} = useUser();
    const [show, setShow] = useState(false);

    const handleChange =
        (key: string, value: any) => (event: ChangeEvent<HTMLInputElement>) => {
            setDto(_dto => ({..._dto, [key]: event.target.value}));
        };

    const handleRegistration = () => {
        upsertUser(dto)
            .then(newUser => {
                toast.success(`Welcome ${dto.name}!`);
                navigate(`/products`);
            })
            .catch(e => {
                toast.error(e.message);
            });
    }

    const handleClickShowPassword = () => {
        setShow(!show)
    };

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return <Box
        sx={{p: {xs: 2, sm: 3}, pt: {sm: 3}, flexGrow: 1, minHeight: 0, marginInline: 'auto'}}
    >
        < Paper
            className="AdminUser"
            sx={{p: {xs: 2, sm: 3}, py: {sm: 8}, position: 'relative'}}
        >
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        primary: {
                            main: '#5dd886',
                        },
                    },
                    typography: {
                        fontFamily: ['DM Sans', '-apple-system', 'Arial'].join(','),
                    },
                    components: {
                        MuiTextField: {
                            defaultProps: {
                                fullWidth: true,
                            },
                        },
                        MuiButton: {
                            defaultProps: {
                                color: 'primary',
                                variant: 'outlined',
                            },
                            styleOverrides: {
                                root: {
                                    borderRadius: '30px',
                                },
                                contained: {
                                    color: 'white',
                                    boxShadow: 'none',
                                    fontWeight: 'bold',
                                },
                            },
                        },
                    },
                })}
            >
                <Box className="container relative" component="form" noValidate autoComplete="off">
                    <Avatar
                        src={user?.avatar}
                        alt="user avatar"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '40px',
                        }}
                    />
                    <Grid
                        container
                        display="grid"
                        gap={4}
                        gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                    >
                        <Grid item>
                            <TextField
                                label="Name"
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Surname"
                                onChange={e => handleChange('surname', e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Email"
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={show ? 'text' : 'password'}
                                    value={dto.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {show ? (
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
                        <Grid item>
                            <TextField
                                label="Avatar"
                                onChange={e => handleChange('avatar', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button onClick={handleRegistration} variant="contained"
                            sx={{px: 3, position: 'absolute', bottom: 0, right: 0}}>
                        Register
                    </Button>
                </Box>
            </ThemeProvider>
        </Paper>
    </Box>
}