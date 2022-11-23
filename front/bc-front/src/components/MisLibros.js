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
import NewBookForm from './NewBookForm';
import { requirePropFactory } from '@mui/material';



const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const theme = createTheme();

export default function MisLibros(props) {

        const [books, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/books/me',
                requestConfig: {
                        headers: {
                                'Content-Language': 'en-US',
                                'Authorization': `Bearer ${localStorage.getItem('atoken')}`
                        },
                        data: {

                        }
                }
        })

        const createNewBook = () => {

        }

        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AppBar position="relative">
                                <Toolbar style={{ "display": "flex", "justifyContent": "space-around" }}>
                                        <Button style={{ "color": "white" }} href="/Catalogo">Catalogo 📜</Button>
                                        <Button style={{ "color": "white" }} href="/MisLibros">Mis libros 📚</Button>
                                        <Button style={{ "color": "white" }} href="/MisPrestamos">Prestamos ♻️</Button>
                                        <Button style={{ "color": "white" }} href="/">Salir 👋🏻</Button>

                                </Toolbar>
                        </AppBar>
                        <main>
                                {/* Hero unit */}
                                <Box
                                        sx={{
                                                bgcolor: 'background.paper',
                                                pt: 6,
                                                pb: 2,
                                        }}>
                                        <Container maxWidth="sm">
                                                <Typography
                                                        component="h1"
                                                        variant="h2"
                                                        align="center"
                                                        color="text.primary"
                                                        gutterBottom
                                                >
                                                        Mis Libros
                                                </Typography>
                                        </Container>
                                </Box>
                                {!books.myBooks && <h1 style={{ textAlign: "center", position: '', backgroundColor: '#ff8c00' }}>¡ Unauthorized, please <a href="/">sign in!</a></h1>}
                                <Container sx={{ py: 8 }} maxWidth="md">
                                        {books.myBooks && <Button href="/createBook" style={{ backgroundColor: 'silver', }}>Add New Book</Button>}

                                        {/* End hero unit */}
                                        <h1 style={{ "textAlign": "center" }}>Books Borrowed From Me</h1>

                                        {books.myBooks && <Grid container spacing={4}> {books.myBooks.booksBorrowedFromMe.map((card) => (<Grid item key={card} xs={12} sm={6} md={4}><Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                        {card.title}
                                                </Typography>
                                                <CardMedia
                                                        component="img"
                                                        sx={{
                                                                // 16:9
                                                                pt: '20px',
                                                        }}
                                                        image="https://source.unsplash.com/random"
                                                        alt="random"
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                        {/* <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography> */}
                                                        <Typography>
                                                                {card.publisher}
                                                        </Typography>
                                                        <Typography>
                                                                Autor:{card.author.lastName}
                                                        </Typography>

                                                </CardContent>
                                                <CardActions>
                                                        <Button size="small">Ver detalle</Button>
                                                </CardActions>
                                        </Card>
                                        </Grid>
                                        ))}
                                        </Grid>}
                                        <h1 style={{ "textAlign": "center" }}>My available books</h1>
                                        {books.myBooks && <Grid container spacing={4}> {books.myBooks.availableBooks.map((card) => (<Grid item key={card} xs={12} sm={6} md={4}><Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                        {card.title}
                                                </Typography>
                                                <CardMedia
                                                        component="img"
                                                        sx={{
                                                                // 16:9
                                                                pt: '20px',
                                                        }}
                                                        image="http://localhost:3333/covers/${card.myBooks.coverId}"
                                                        alt="random"
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                        {/* <Typography gutterBottom variant="h5" component="h2">
                                                                Heading
                                                                </Typography> */}
                                                        <Typography>
                                                                {card.publisher}
                                                        </Typography>
                                                        <Typography>
                                                                Autor:{card.author.lastName}
                                                        </Typography>

                                                </CardContent>
                                                <CardActions>
                                                        <Button size="small">Ver detalle</Button>
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