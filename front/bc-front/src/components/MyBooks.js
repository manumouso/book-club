import useAxios from '../hooks/useAxios'
import axios from "../apis/private"

const MyBooks = () => {


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

        return (
                <div>
                        <h1>My Books</h1>
                        {loading && <p>Loading...</p>}

                        {!loading && error && <p className='errMsg'>{error}</p>}

                        {!loading && !error && books &&
                                <ul>
                                        {/* esta linea tiene que ir acorde, agregar a las cards o lo q sea necesario */}
                                        <p><u>Borrowed</u></p>
                                        {books.myBooks.booksBorrowedFromMe.map(post => (<li key={post.id}>{post.id} {post.title} <u>Borrowed by:</u> {post.holder.email}</li>))}
                                </ul>
                        }
                </div>
        )
}

{/* <h2>Available</h2>
{books.myBooks.availableBooks.map(post => (<li key={post.id}>{post.title} {post.year} {post.author.lastName}</li>))} */}



export default MyBooks