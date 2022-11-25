import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import useAxios from '../hooks/useAxios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Grid, Toolbar } from '@mui/material';

const theme = createTheme();

export default function Detail() {
        const [searchParams, setSearchParams] = useSearchParams();
        const idIngresada = searchParams.get("id");

        async function handleBorrow() {
                try {
                        const borrowedBookId = await axios.patch(`http://localhost:3333/users/me/borrows/${idIngresada}`, {}, {
                                headers: {
                                        'Content-Language': 'en-US',
                                        Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                }
                        })
                        alert('Book borrowed. BookId: ' + borrowedBookId.data.borrowedBookId)  /// VA OK PARA SUCCESS
                } catch (error) {
                        alert(error.response.data.message); /// VA BIEN PARA TODOS LOS ERRORES
                }
        }

        async function handleReturn() {
                try {
                        const returnedBook = await axios.patch(`http://localhost:3333/users/me/returns/${idIngresada}`, {}, {
                                headers: {
                                        'Content-Language': 'en-US',
                                        Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                }
                        })
                        alert('Book returned. BookId: ' + returnedBook.data.returnedBookId) /// VA OK PARA SUCCESS
                } catch (error) {
                        alert(error.response.data.message) /// VA BIEN PARA TODOS LOS ERRORES
                }
        }

        const [bookDetail, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: `http://localhost:3333/books/details/${idIngresada}`,
                requestConfig: {
                        headers: {
                                'Content-Language': 'en-US',
                                'Authorization': `Bearer ${localStorage.getItem('atoken')}`
                        },
                        data: {

                        }
                }
        })


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
                        <Box sx={{
                                bgcolor: 'background.paper',
                                pt: 8,
                                pb: 6,
                        }}>
                                <Container maxWidth="sm">
                                        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>Book Detail</Typography>
                                </Container>
                        </Box>
                        {!bookDetail.book && <h1 className='unAuthorized'>¡ Unauthorized, please <a href="/">sign in!</a></h1>}
                        <Container sx={{ py: 8 }} maxWidth="md">
                                {bookDetail.book && <Grid container spacing={4}>
                                        {bookDetail.book && <Grid>
                                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                                {bookDetail.book.title}
                                                        </Typography>
                                                        <CardMedia
                                                                component="img"
                                                                sx={{
                                                                        pt: '20px',
                                                                }}
                                                                image={`http://localhost:3333/covers/${bookDetail.book.id}`}
                                                                alt="random"
                                                        />
                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        ISBN: {bookDetail.book.isbn}
                                                                </Typography>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        Year:{bookDetail.book.year}
                                                                </Typography>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        Publisher: {bookDetail.book.publisher}
                                                                </Typography>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        Author: {bookDetail.book.author.firstName} {bookDetail.book.author.lastName}
                                                                </Typography>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        Genre: {bookDetail.book.genre.name}
                                                                </Typography>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                        Synopsis: {bookDetail.book.synopsis}
                                                                </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                                <Button onClick={() => { handleBorrow() }} color="success" size="large">Borrow</Button>
                                                                <Button onClick={() => { handleReturn() }} color="error" size="large">Return</Button>
                                                        </CardActions>
                                                </Card>
                                        </Grid>
                                        }
                                </Grid>}
                        </Container>
                </ThemeProvider>
        )
}
