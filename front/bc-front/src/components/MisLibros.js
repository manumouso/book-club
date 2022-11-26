import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useAxios from '../hooks/useAxios';
import axios from '../apis/private'
import { Navigate, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrivateToolBar from './PrivateToolBar';
import Unauthorized from './Unauthorized';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const theme = createTheme();

export default function MisLibros(props) {

        const navigate = useNavigate();

        const viewDetail = (id) => {
                let a = document.getElementById(id)
                return (
                        navigate(`/Details/?id=${a.id}`)
                )
        }

        const deleteBook = async (id) => {
                if (window.confirm("Do you really want to delete?")) {
                        try {
                                let a = document.getElementById(id)
                                const deleteBook = await axios.delete(`http://localhost:3333/books/me/${a.id}`, {
                                        headers: {
                                                'Content-Language': 'en-US',
                                                Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                        }
                                })
                                if (deleteBook.status === 401) {
                                        console.log('token ');  //// esto se va a borrar con lo q pone octo
                                }
                                alert('Deleted !')
                                document.location.reload(true);
                        } catch (error) {
                                alert(error.response.data.message);
                        }
                }
        }

        const editCover = async (id) => {
                let a = document.getElementById(id)
                return (
                        navigate(`/EditCover/?id=${a.id}`)
                )
        }

        const editBook = async (id) => {
                let a = document.getElementById(id)
                return (
                        navigate(`/EditBook/?id=${a.id}`)
                )
        }

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

        function clearToken()
        {
                localStorage.removeItem('atoken');
        }

        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <PrivateToolBar />
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
                                                        My books
                                                </Typography>
                                        </Container>
                                </Box>
                                {!books.myBooks && <Unauthorized />}
                                <Container sx={{ py: 8 }} maxWidth="md">
                                        {books.myBooks && <Button href="/createBook" sx={{ display: 'flex', justifyContent: 'space-between', width: '19%', '& button': { m: 1 } }} size="large" variant="contained"><AddCircleOutlineIcon />New Book</Button>}

                                        {/* End hero unit */}
                                        {books.myBooks && <h1 style={{ "textAlign": "center" }}>My Books That Have Been Borrowed</h1>}

                                        {books.myBooks && <Grid container spacing={4}> {books.myBooks.booksBorrowedFromMe.map((card) => (<Grid item key={card} xs={12} sm={6} md={4}><Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Typography gutterBottom id={card.id} variant="h5" component="h5">
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
                                                        alt="book image"
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                        {/* <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography> */}
                                                        <Typography>
                                                                Autor:{card.author.lastName}
                                                        </Typography>
                                                        <Typography>
                                                                Holder: {card.holder.email}
                                                        </Typography>
                                                        <Typography>
                                                                Withdrawn At: {card.withdrawnAt.substring(0, 10)}
                                                        </Typography>

                                                </CardContent>
                                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button onClick={() => { viewDetail(card.id) }} size="small">View Details</Button>
                                                        <EditIcon onClick={() => { editBook(card.id) }} cursor='pointer' ></EditIcon>
                                                        <InsertPhotoIcon cursor='pointer' onClick={() => { editCover(card.id) }} />
                                                        <DeleteIcon cursor='pointer' onClick={() => { deleteBook(card.id) }} color='error'></DeleteIcon>

                                                </CardActions>
                                        </Card>
                                        </Grid>
                                        ))}
                                        </Grid>}
                                        {books.myBooks && <h1 style={{ "textAlign": "center" }}>My Available Books</h1>}
                                        {books.myBooks && <Grid container spacing={4}> {books.myBooks.availableBooks.map((card) => (<Grid item key={card} xs={12} sm={6} md={4}><Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Typography gutterBottom id={card.id} variant="h5" component="h5">
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
                                                        alt="book image"
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                        {/* <Typography gutterBottom variant="h5" component="h2">
                                                                Heading
                                                                </Typography> */}

                                                        <Typography>
                                                                Autor:{card.author.lastName}
                                                        </Typography>

                                                </CardContent>
                                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button onClick={() => { viewDetail(card.id) }} size="small">View Details</Button>
                                                        <EditIcon cursor='pointer' onClick={() => { editBook(card.id) }} ></EditIcon>
                                                        <InsertPhotoIcon cursor='pointer' onClick={() => { editCover(card.id) }} />
                                                        <DeleteIcon cursor='pointer' onClick={() => { deleteBook(card.id) }} color='error'></DeleteIcon>
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