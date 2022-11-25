import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import fondoLibro from "../utils/imagenes/libro_bg.jpg";
import useAxios from '../hooks/useAxios';
import axios from "../apis/private"
import { useState } from 'react';
import { Route, withRouter, useNavigate } from 'react-router-dom';

const theme = createTheme();

export default function SignUp(props) {

        const navigate = useNavigate();

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [user, setUser] = useState(null)


        function redirectHomePage() {
                return (
                        navigate('/MyBooks')
                )
        }

        function handleGuest() {
                localStorage.clear('atoken')
        }


        const handleSubmit = async (event, props) => {

                event.preventDefault();
                const data = new FormData(event.currentTarget);

                try {

                        const datos = {
                                email: data.get('email'),
                                password: data.get('password')
                        }
                        const resp = await axios.post("http://localhost:3333/auth/signup", datos);

                        localStorage.setItem('atoken', resp.data.access_token)
                        setUser(user)
                        setPassword('')
                        setUsername('')

                        redirectHomePage()

                } catch (e) {
                        alert(e.response.data.message)
                }

        };


        return (
                <ThemeProvider theme={theme}>
                        <Grid container component="main" sx={{ height: '100vh' }}>
                                <CssBaseline />
                                <Grid
                                        item
                                        xs={false}
                                        sm={4}
                                        md={7}
                                        sx={{
                                                backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/06/10/16/22/coffee-2390136_960_720.jpg)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundColor: (t) =>
                                                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'left',
                                        }}
                                />
                                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                                        <Box
                                                sx={{
                                                        my: 8,
                                                        mx: 4,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                }}
                                        >
                                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                                        <LockOutlinedIcon />
                                                </Avatar>
                                                <Typography component="h1" variant="h5">
                                                        Sign up
                                                </Typography>
                                                <Box
                                                        component="form"
                                                        noValidate
                                                        onSubmit={handleSubmit}
                                                        sx={{ mt: 1 }}>
                                                        <TextField
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                id="email"
                                                                label="email"
                                                                name="email"
                                                                autoComplete="email"
                                                                autoFocus
                                                        />
                                                        <TextField
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                name="password"
                                                                label="password"
                                                                type="password"
                                                                id="password"
                                                                autoComplete="current-password"
                                                        />
                                                        {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
                                                        <Button
                                                                type="submit"
                                                                fullWidth
                                                                variant="contained"
                                                                sx={{ mt: 3, mb: 2 }}
                                                        >
                                                                Sign up
                                                        </Button>
                                                        <Button
                                                                type="button"
                                                                fullWidth
                                                                variant="contained"
                                                                color='secondary'
                                                                href='/catalog'
                                                                onClick={handleGuest}
                                                                sx={{ mt: 3, mb: 2 }}
                                                        >
                                                                Go to public catalog
                                                        </Button>
                                                </Box>
                                        </Box>
                                </Grid>
                        </Grid>
                </ThemeProvider>
        );
}
