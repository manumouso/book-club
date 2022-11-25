import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import useAxios from '../hooks/useAxios';
import styles from '../styles.css'

const NewBookForm = () => {

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();

        const getAuthors = async () => {
                try {
                        const resp = await axios.get('http://localhost:3333/authors')

                } catch (error) {
                        console.log(error.data.response);
                }
        }

        const authors = getAuthors()

        const onSubmit = async (data) => {

                const data2post = {
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

                //ToDo: fieldsValidator
                const validated = true
                // validated? createBook : rollback
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
                                                                <div>
                                                                        <label for="cars">Choose an author:</label>
                                                                        <select name="cars" id="cars">
                                                                                <option value="volvo">maxi</option>
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label for="cars">Choose a genre:</label>
                                                                        <select name="cars" id="cars">
                                                                                <option value="volvo">maxi</option>
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label>AuthorId: </label>
                                                                        <input type="text" {...register('authorId', {
                                                                                required: true,
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>GenreId: </label>
                                                                        <input type="text" {...register('genreId', {
                                                                                required: true,
                                                                                maxLength: 60
                                                                        })} />
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