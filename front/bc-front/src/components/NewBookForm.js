import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import AddCover from "./AddCover";
import Button from '@mui/material/Button';


const NewBookForm = () => {

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();

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
                                console.log(resp);
                                if (resp.status === 201) {
                                        alert('creado!!')
                                        return (
                                                navigate(`/coverUpload/?id=${resp.data.book.id}`)
                                        )
                                }
                        } catch (error) {
                                console.log(error);
                        }
                }
        }

        return (
                <div style={{ textAlign: 'center' }}>
                        <h2>New Book 📔</h2>
                        <h3>Please fill out 👇</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                        <label>Title: </label>
                                        <input type="text" {...register('title', {
                                                required: true,
                                                maxLength: 60
                                        })} />
                                </div>
                                <div>
                                        <label>Publisher: </label>
                                        <input type="text" {...register('publisher', {
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
                                <div>
                                        <label>Synopsis: </label>
                                        <input type="text" {...register('synopsis', {
                                                required: true,
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
                                        <p>Author</p>
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
                                <input type="submit" value='Submit' />

                        </form>
                        <br />
                        <br />
                        <br />

                </div>
        )
}

export default NewBookForm