import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useAxios from '../hooks/useAxios';
import axios from '../apis/private'
import { Navigate, useNavigate } from "react-router-dom";


const cards = [45];

const theme = createTheme();

export default function MisPrestamos() {

        const navigate = useNavigate();

        const viewDetail = (id) => {
                let a = document.getElementById(id)
                return (
                        navigate(`/Details/?id=${a.id}`)
                )
        }

        const [books, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/books/me',
                requestConfig: {
                        headers: {
                                'Content-Language': 'en-US',
                        },
                        data: {

                        }
                }
        })

        function clearToken()
        {
                localStorage.removeItem('atoken');
        }

        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AppBar position="relative">
                                <Toolbar style={{ "display": "flex", "justifyContent": "space-around" }}>
                                        <Button style={{ "color": "white" }} href="/Catalogo">Catalogo 📜</Button>
                                        <Button style={{ "color": "white" }} href="/MisLibros">Mis libros 📚</Button>
                                        <Button style={{ "color": "white" }} href="/MisPrestamos">Prestamos ♻️</Button>
                                        <Button onClick={ clearToken } style={{ "color": "white" }} href="/">Salir 👋🏻</Button>
                                </Toolbar>
                        </AppBar>
                        <main>
                                {/* Hero unit */}
                                <Box
                                        sx={{
                                                bgcolor: 'background.paper',
                                                pt: 8,
                                                pb: 6,
                                        }}
                                >
                                        <Container maxWidth="sm">
                                                <Typography
                                                        component="h1"
                                                        variant="h2"
                                                        align="center"
                                                        color="text.primary"
                                                        gutterBottom
                                                >
                                                        My borrows
                                                </Typography>
                                        </Container>
                                </Box>
                                {!books.myBorrows && <h1 style={{ textAlign: "center", position: '', backgroundColor: '#ff8c00' }}>¡ Unauthorized, please <a href="/">sign in!</a></h1>}
                                <Container sx={{ py: 8 }} maxWidth="md">
                                        {/* End hero unit */}
                                        {books.myBorrows && <Grid container spacing={4}>
                                                {books.myBorrows.map((card) => (
                                                        <Grid item key={card} xs={12} sm={6} md={4}>
                                                                <Card
                                                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                                                >
                                                                        <Typography id={card.id} gutterBottom variant="h5" component="h2">
                                                                                {card.id}
                                                                        </Typography>
                                                                        <Typography gutterBottom variant="h5" component="h2">
                                                                                {card.title}
                                                                        </Typography>
                                                                        <CardMedia
                                                                                component="img"
                                                                                sx={{
                                                                                        // 16:9
                                                                                        pt: '20px',
                                                                                }}
                                                                                image={`http://localhost:3333/covers/${card.id}`}
                                                                                alt="random"
                                                                        />
                                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                                                {/* <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography> */}
                                                                                <Typography>
                                                                                        Author: {card.author.lastName}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Withdrawn At: {card.withdrawnAt.substring(0, 10)}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Owner: {card.owner.email}
                                                                                </Typography>
                                                                        </CardContent>
                                                                        <CardActions>
                                                                                <Button onClick={() => { viewDetail(card.id) }} size="small">View details</Button>
                                                                        </CardActions>
                                                                </Card>
                                                        </Grid>
                                                ))}
                                        </Grid>}
                                </Container>
                        </main>
                        {/* Footer */}
                        {/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          cosas de footer
        </Typography>
      </Box> */}
                        {/* End footer */}
                </ThemeProvider>
        );
}