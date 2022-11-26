import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import useAxios from '../hooks/useAxios';
import { useSearchParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useState } from "react";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

const EditBook = () => {

        const [searchParams, setSearchParams] = useSearchParams();
        const idIngresada = searchParams.get("id");

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();
        const [autores, setAutores] = useState()
        const [generos, setGeneros] = useState()
        const [crearAutor, setCrearAutor] = useState(false)

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

        const getAuthors = async () => {
                try {
                        const resp = await axios.get('http://localhost:3333/authors')
                        setAutores(resp.data.authors);
                } catch (error) {
                        console.log(error.data.response);
                }
        }

        const getGenres = async () => {
                try {
                        const resp = await axios.get('http://localhost:3333/genres')
                        setGeneros(resp.data.genres);

                } catch (error) {
                        console.log(error.data.response);
                }
        }

        const authors = getAuthors()
        const genres = getGenres()

        const onSubmit = async (data) => {
                let data2post;

                if (!(data.firstName && data.lastName)) {
                        data2post = {
                                isbn: data.isbn,
                                title: data.title,
                                year: data.year,
                                publisher: data.publisher,
                                synopsis: data.synopsis,
                                authorId: data.authorId,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                genreId: data.genreId,
                        }
                }
                else {
                        data2post = {
                                isbn: data.isbn,
                                title: data.title,
                                year: data.year,
                                publisher: data.publisher,
                                synopsis: data.synopsis,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                genreId: data.genreId,
                        }
                }

                const newBook = {
                        isbn: bookDetail.book.isbn,
                        title: bookDetail.book.title,
                        publisher: bookDetail.book.publisher,
                        year: bookDetail.book.year,
                        synopsis: bookDetail.book.synopsis,
                        firstName: bookDetail.book.author.firstName,
                        lastName: bookDetail.book.author.lastName,
                        genreId: bookDetail.book.genre.id,
                }

                let a = Object.values(data2post)
                let b = Object.values(newBook)
                let d = Object.entries(data2post)

                let ob = {}

                for (let index = 0; index < 9; index++) {
                        if (a[index] != b[index]) {
                                Object.defineProperty(ob, d[index][0], {
                                        value: d[index][1], writable: true,
                                        enumerable: true, configurable: true
                                });
                        }
                }

                if (Object.entries(ob).length !== 0) {
                        try {
                                const resp = await axios.patch(`http://localhost:3333/books/me/${idIngresada}`, ob, {
                                        headers: {
                                                'Content-Language': 'en-US',
                                                Authorization: `Bearer ${localStorage.getItem('atoken')}`,
                                        }
                                })
                                if (resp.status === 200) {
                                        return (
                                                navigate('/MyBooks')
                                        )
                                }
                        } catch (error) {
                                alert(error.response.data.message);
                        }
                }

        }
        return (
                <div className="bookCardStyle">
                        <div>
                                <Card sx={{
                                        width: 550,
                                        height: 550,
                                        backgroundColor: '#AED6F1',
                                        margin: 'auto',
                                }}>
                                        {bookDetail.book && <CardContent >
                                                <div>
                                                        <h2>Edit Book ✏️</h2>
                                                        <h3>Please fill out 👇</h3>
                                                        <form className="formCustom" onSubmit={handleSubmit(onSubmit)}>
                                                                <div>
                                                                        <label>Title: </label>
                                                                        <input defaultValue={bookDetail.book.title} type="text" {...register('title', {
                                                                                required: true,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Publisher: </label>
                                                                        <input defaultValue={bookDetail.book.publisher} type="text"  {...register('publisher', {
                                                                                required: true,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Year: </label>
                                                                        <input defaultValue={bookDetail.book.year} type="text" {...register('year', {
                                                                                required: true,
                                                                        })} />
                                                                </div>
                                                                <div className="synopsisClass">
                                                                        <label>Synopsis: </label>
                                                                        <textarea defaultValue={bookDetail.book.synopsis} type="text" {...register('synopsis', {
                                                                                required: false,
                                                                                maxLength: 200
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>ISBN: </label>
                                                                        <input defaultValue={bookDetail.book.isbn} type="text" {...register('isbn', {
                                                                                required: true,
                                                                        })} />
                                                                </div>
                                                                {!crearAutor && <div>
                                                                        <label>Choose an author: </label>
                                                                        {autores && <select name="autores" id="autor" {...register('authorId', { required: true, })}>
                                                                                {autores.map((autor) => (
                                                                                        <option key={autor.id} value={autor.id} >{autor.firstName + " " + autor.lastName}</option>
                                                                                ))}
                                                                        </select>
                                                                        }
                                                                </div>}
                                                                <div>
                                                                        <label>Choose a genre: </label>
                                                                        {autores && <select name="cars" id="cars" {...register('genreId', { required: true, })}>
                                                                                {generos.map((genero) => (
                                                                                        <option key={genero.id} value={genero.id} >{genero.name}</option>
                                                                                ))}
                                                                        </select>
                                                                        }
                                                                </div>
                                                                {crearAutor && <div><div>
                                                                        <label>New author </label>
                                                                </div>
                                                                        <div>
                                                                                <label>First name: </label>
                                                                                <input defaultValue={bookDetail.book.author.firstName} type="text" {...register('firstName', {
                                                                                        required: true,
                                                                                        maxLength: 60
                                                                                })} />
                                                                        </div>
                                                                        <div>
                                                                                <label>Last name: </label>
                                                                                <input defaultValue={bookDetail.book.author.lastName} type="text" {...register('lastName', {
                                                                                        required: true,
                                                                                        maxLength: 60
                                                                                })} />
                                                                        </div>
                                                                </div>
                                                                }
                                                                {!crearAutor && <Button variant="contained" style={{ "margin": "5px 0px 5px", "fontSize": "10px" }} onClick={() => { setCrearAutor(true) }} >Create an Author</Button>}
                                                                {crearAutor && <Button variant="contained" style={{ "margin": "5px 0px 5px", "fontSize": "10px" }} onClick={() => { setCrearAutor(false) }} >chose an Author</Button>}

                                                                <input className="buttonsCustom" type="submit" value='Update Book' />
                                                        </form>
                                                </div>
                                        </CardContent>}
                                        <CardActions>
                                                <Button href="/MyBooks" size="small">Back to my books</Button>
                                        </CardActions>
                                </Card>
                        </div>
                </div>
        )
}
export default EditBook