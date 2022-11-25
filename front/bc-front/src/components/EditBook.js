import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import useAxios from '../hooks/useAxios';
import { useSearchParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const EditBook = () => {

        const [searchParams, setSearchParams] = useSearchParams();
        const idIngresada = searchParams.get("id");

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();

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

        const onSubmit = async (data) => {
                const data2post = {
                        isbn: data.isbn,
                        title: data.title,
                        publisher: data.publisher,
                        year: data.year,
                        synopsis: data.synopsis,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        genre: data.genre,
                }
                const newBook = {
                        isbn: bookDetail.book.isbn,
                        title: bookDetail.book.title,
                        publisher: bookDetail.book.publisher,
                        year: bookDetail.book.year,
                        synopsis: bookDetail.book.synopsis,
                        firstName: bookDetail.book.author.firstName,
                        lastName: bookDetail.book.author.lastName,
                        genre: bookDetail.book.genre.name,
                }

                let a = Object.values(data2post)
                let b = Object.values(newBook)
                let d = Object.entries(data2post)

                let ob = {}

                for (let index = 0; index < 8; index++) {
                        if (a[index] != b[index] && a[index] !== '') {
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
                                                navigate('/MisLibros')
                                        )
                                }
                        } catch (error) {
                                alert(error.response.data.message);
                        }
                }

        }
        return (
                <div className="bookCardStyle">
                        {!bookDetail.book && <h1 className="unAuthorized">¡ Unauthorized, please <a href="/">sign in!</a></h1>}
                        {bookDetail.book && <div>
                                <Card sx={{
                                        width: 550,
                                        height: 550,
                                        backgroundColor: '#AED6F1',
                                        margin: 'auto',
                                }}>
                                        <CardContent >
                                                <div>
                                                        <h2>Edit Book ✏️</h2>
                                                        <h3>Please fill out 👇</h3>
                                                        <form className="formCustom" onSubmit={handleSubmit(onSubmit)}>
                                                                <div>

                                                                        <label>ISBN: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.isbn}  {...register('isbn', {
                                                                                required: false,
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Title: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.title}  {...register('title', {
                                                                                required: false,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Year: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.year} {...register('year', {
                                                                                required: false,
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Publisher: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.publisher}  {...register('publisher', {
                                                                                required: false,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div className="synopsisClass">
                                                                        <label>Synopsis: </label>
                                                                        <textarea type="text" defaultValue={bookDetail.book.synopsis} {...register('synopsis', {
                                                                                required: false,
                                                                                maxLength: 200
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Author first name: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.author.firstName} {...register('firstName', {
                                                                                required: false,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Author last name: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.author.lastName}  {...register('lastName', {
                                                                                required: false,
                                                                        })} />
                                                                </div>
                                                                <div>
                                                                        <label>Genre: </label>
                                                                        <input type="text" defaultValue={bookDetail.book.genre.name} {...register('genre', {
                                                                                required: false,
                                                                                maxLength: 60
                                                                        })} />
                                                                </div>
                                                                <input className="buttonsCustom" type="submit" value='Edit Book' />
                                                        </form>
                                                </div>
                                        </CardContent>
                                        <CardActions>
                                                <Button href="/MisLibros" size="small">Back to my books</Button>
                                        </CardActions>
                                </Card>
                        </div>
                        }
                </div>
        )
}
export default EditBook