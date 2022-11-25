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
import axios1 from 'axios'
import Select from 'react-select';
import { TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

const theme = createTheme();

async function getAmount() {
        const cards = await axios1.get('http://localhost:3333/books/amount')
}

// ToDo usar esta fun p ver detalle de foto
async function getCover(bookId) {
        return await axios1.get('http://localhost:3333/covers/' + bookId, { headers: { 'Content-Type': 'image/png' } }).then(covers => {
                return Promise.resolve(covers);
        });
}


export default function Catalogo() {

        const navigate = useNavigate();

        const viewDetail = (id) => {
                let a = document.getElementById(id)
                return (
                        navigate(`/Details/?id=${a.id}`)
                )
        }

        const [librosPresentados, setLibrosPresentados] = React.useState()
        const [mostrarFiltados, setMostrarFiltrados] = React.useState(false)

        //ToDo usar amount para el paginado
        const amount = getAmount()

        const [books, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/books',
                requestConfig: {
                        headers: {
                                'Content-Language': 'en-US',
                        },
                        data: {

                        }
                }
        })

        const [SelectedOption, setSelectedOptions] = React.useState();

        const busquedaFiltrada = async (event) => {

                event.preventDefault()
                const data = new FormData(event.currentTarget);
                const filter = data.get('filtro')

                try {
                        const filteredBooks = await axios1(`http://localhost:3333/books/filterBy?filter=${SelectedOption}&value=${filter}`, {
                                headers: {
                                        'Content-Language': 'en-US',
                                        'Authorization': `Bearer ${localStorage.getItem('atoken')}`
                                }
                        })
                        console.log(librosPresentados)
                        setLibrosPresentados(filteredBooks.data)
                        setMostrarFiltrados(true)
                } catch (error) {
                        alert(error.response.data.message)
                }
        }

        const resetearFiltros = () => {
                setMostrarFiltrados(false)
                console.log(books)
        }

        const opcionesBusqueda = [
                { value: "isbn", label: "ISBN" },
                { value: "title", label: "Titulo" },
                { value: "year", label: "Año" },
                { value: "publisher", label: "Editorial" },
                { value: "firstName", label: "Primer nombre del autor" },
                { value: "genre", label: "Género" },
                { value: "lastName", label: "Apellido del autor" },
        ]

        const token = localStorage.getItem('atoken')

        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {token && <AppBar position="relative">
                                <Toolbar style={{ "display": "flex", "justifyContent": "space-around" }}>
                                        <Button style={{ "color": "white" }} href="/Catalogo">Catalogo 📜</Button>
                                        <Button style={{ "color": "white" }} href="/MisLibros">Mis libros 📚</Button>
                                        <Button style={{ "color": "white" }} href="/MisPrestamos">Prestamos ♻️</Button>
                                        <Button style={{ "color": "white" }} href="/">Salir 👋🏻</Button>

                                </Toolbar>
                        </AppBar>}
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
                                                        Catálogo
                                                </Typography>
                                                <Box onSubmit={busquedaFiltrada} component='form'
                                                        style={{ "display": "block", "width": "100%", "alignItems": "center", "justifyContent": "space-around" }}>
                                                        <Select
                                                                placeholder={"Seleccione uno..."}
                                                                options={opcionesBusqueda}
                                                                onChange={(item) => {
                                                                        setSelectedOptions(item.value);
                                                                }}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={false}
                                                                isRtl={false}
                                                                closeMenuOnSelect={true}
                                                        />
                                                        <TextField
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                id="filtro"
                                                                label="filtro"
                                                                name="filtro"
                                                                autoComplete="email"
                                                                autoFocus
                                                        />
                                                        <Button type='submit' variant='contained'>Buscar</Button>
                                                        <Button type='button' variant='contained' color='secondary' onClick={resetearFiltros}>Borrar filtros</Button>
                                                </Box>
                                        </Container>
                                </Box>
                                <Container sx={{ py: 8 }} maxWidth="md">
                                        {!mostrarFiltados && books.books && <Grid container spacing={4}>
                                                {books.books.map((card) => (
                                                        <Grid item key={card.id} xs={12} sm={6} md={4}>
                                                                <Card
                                                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                                                ><Typography id={card.id} gutterBottom variant="h6" component="h2">
                                                                                {card.id}
                                                                        </Typography>
                                                                        <Typography gutterBottom variant="h5" component="h2">
                                                                                {card.title}
                                                                        </Typography>

                                                                        <CardMedia
                                                                                component="img"
                                                                                sx={{
                                                                                        pt: '20px',
                                                                                }}
                                                                                image={`http://localhost:3333/covers/${card.id}`}
                                                                                alt="random"
                                                                        />
                                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                                                <Typography>
                                                                                        Author: {card.author.lastName}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Year: {card.year}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Publisher: {card.publisher}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Genre: {card.genre.name}
                                                                                </Typography>
                                                                        </CardContent>
                                                                        <CardActions>
                                                                                <Button onClick={() => { viewDetail(card.id) }} size="small">View Details</Button>
                                                                        </CardActions>
                                                                </Card>
                                                        </Grid>
                                                ))}
                                        </Grid>}
                                        {mostrarFiltados && librosPresentados && <Grid container spacing={4}>
                                                {librosPresentados.books.map((card) => (
                                                        <Grid item key={card.id} xs={12} sm={6} md={4}>
                                                                <Card
                                                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                                                ><Typography id={card.id} gutterBottom variant="h6" component="h2">
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
                                                                                <Typography>
                                                                                        Author: {card.author.lastName}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Year: {card.year}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Publisher: {card.publisher}
                                                                                </Typography>
                                                                                <Typography>
                                                                                        Genre: {card.genre.name}
                                                                                </Typography>
                                                                        </CardContent>
                                                                        <CardActions>
                                                                                <Button onClick={() => { viewDetail(card.id) }} size="small">View Details</Button>
                                                                        </CardActions>
                                                                </Card>
                                                        </Grid>
                                                ))}
                                        </Grid>}
                                </Container>
                        </main>
                </ThemeProvider>
        );
}