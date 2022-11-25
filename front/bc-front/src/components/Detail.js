import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import useAxios from '../hooks/useAxios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
//import { useSearchParams } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Grid, Toolbar } from '@mui/material';
import { Navigate, useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Detail() {

        const navigate = useNavigate();

        async function handleBorrow() {
                try {
                        //`http://localhost:3333/users/me/borrows/${idIngresada}`
                        const borrowedBookId = await axios.patch('http://localhost:3333/users/me/borrows/7', {}, {
                                headers: {
                                        'Content-Language': 'en-US',
                                        Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                }
                        })
                        alert('Book borrowed. BookId: ' + borrowedBookId.data.borrowedBookId)  /// VA OK PARA SUCCESS
                } catch (error) {
                        if (error.response.status === 401)
                        {
                                navigate(`/Unauthorized`)
                        }
                        else
                        {
                                alert(error.response.data.message) /// VA BIEN PARA TODOS LOS ERRORES
                        }
                }
        }

        async function handleReturn() {
                try {
                        //`http://localhost:3333/users/me/borrows/${idIngresada}`
                        const returnedBook = await axios.patch('http://localhost:3333/users/me/returns/7', {}, {
                                headers: {
                                        'Content-Language': 'en-US',
                                        Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                }
                        })
                        alert('Book returned. BookId: ' + returnedBook.data.returnedBookId) /// VA OK PARA SUCCESS
                } catch (error) {
                        if (error.response.status === 401)
                        {
                                navigate(`/Unauthorized`)
                        }
                        else
                        {
                                alert(error.response.data.message) /// VA BIEN PARA TODOS LOS ERRORES
                        }
                }
        }

        const token = localStorage.getItem('atoken');

        //const [searchParams, setSearchParams] = useSearchParams();
        //const idIngresada = searchParams.get("id");

        // hacer el ?{blabla} magico de Maxi

        //`http://localhost:3333/books/details/${idIngresada}`
        const [bookDetail, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/books/details/2',
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
                                        <Button style={{ "color": "white" }} href="/Catalog">Catalog 📜</Button>
                                        {token && <Button style={{ "color": "white" }} href="/MyBook">My Books 📚</Button>}
                                        {token && <Button style={{ "color": "white" }} href="/MyLoans">My loans ♻️</Button>}
                                        {token && <Button style={{ "color": "white" }} href="/">Logout 👋🏻</Button>}
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
                                                                {token && <Button onClick={() => { handleBorrow() }} color="success" size="large">Borrow</Button>}
                                                                {token && <Button onClick={() => { handleReturn() }} color="error" size="large">Return</Button>}
                                                        </CardActions>
                                                </Card>
                                        </Grid>
                                        }
                                </Grid>}
                        </Container>
                </ThemeProvider>
        )
}
