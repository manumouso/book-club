import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useState } from "react";
import useAxios from '../hooks/useAxios';
import styles from '../styles.css'

const NewBookForm = () => {

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();
        const [autores, setAutores] = useState()
        const [generos, setGeneros] = useState()
        const [crearAutor, setCrearAutor] = useState(false)

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

                const validated = true

                if (validated) {
                        try {
                                const resp = await axios.post("http://localhost:3333/books/me", data2post, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('atoken')}` } });
                                if (resp.status === 201) {
                                        alert('created!')
                                        return (
                                                navigate(`/coverUpload/?id=${resp.data.book.id}`)
                                        )
                                }
                        } catch (error) {
                                alert(error.response.data.message)
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
                                        <CardContent >
                                                <div>
                                                        <h2>New Book 📔</h2>
                                                        <h3>Please fill out 👇</h3>
                                                        <form className="formCustom" onSubmit={handleSubmit(onSubmit)}>
                                                                <div>
                                                                        <label>Title: </label>
                                                                        <input type="text" {...register('title', {
                                                                                required: true,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Publisher: </label>
                                                                        <input type="text"  {...register('publisher', {
                                                                                required: true,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Year: </label>
                                                                        <input type="text" {...register('year', {
                                                                                required: true,
                                                                        })} />
                                                                </div>
                                                                <div className="synopsisClass">
                                                                        <label>Synopsis: </label>
                                                                        <textarea type="text" {...register('synopsis', {
                                                                                required: false,
                                                                                maxLength: 200
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>ISBN: </label>
                                                                        <input type="text" {...register('isbn', {
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
                                                                <div style={{ "visibility": "hidden" }}>
                                                                        <input type="text" value={" "} {...register('lastName', {
                                                                                required: true,
                                                                        })} />
                                                                </div>
                                                                {crearAutor && <div><div>
                                                                        <label>New author </label>
                                                                </div>

                                                                        <div>
                                                                                <label>First name: </label>
                                                                                <input type="text" {...register('firstName', {
                                                                                        required: true,
                                                                                        maxLength: 60
                                                                                })} />
                                                                        </div>
                                                                        <div>
                                                                                <label>Last name: </label>
                                                                                <input type="text" {...register('lastName', {
                                                                                        required: true,
                                                                                        maxLength: 60
                                                                                })} />
                                                                        </div>
                                                                </div>
                                                                }
                                                                {!crearAutor && <Button variant="contained" style={{ "margin": "5px 0px 5px", "fontSize": "10px" }} onClick={() => { setCrearAutor(true) }} >Create an Author</Button>}
                                                                {crearAutor && <Button variant="contained" style={{ "margin": "5px 0px 5px", "fontSize": "10px" }} onClick={() => { setCrearAutor(false) }} >chose an Author</Button>}

                                                                <input className="buttonsCustom" type="submit" value='Create Book' />
                                                        </form>
                                                </div>
                                        </CardContent>
                                        <CardActions>
                                                <Button href="/MisLibros" size="small">Back to my books</Button>
                                        </CardActions>
                                </Card>
                        </div>
                </div>
        )
}

export default NewBookForm