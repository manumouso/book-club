import useAxios from '../hooks/useAxios'
import axios from "../apis/publics";

const PublicBooks = () => {

        const [books, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/books',
                requestConfig: {
                        headers: {
                                'Content-Language': 'en-US'
                                // headers goes here..
                        },
                        data: {

                        }
                }
        })
        return (
                <div>
                        <h2>Public Books</h2>
                        {loading && <p>Loading...</p>}

                        {!loading && error && <p className='errMsg'>{error}</p>}

                        {!loading && !error && books &&
                                <ul>
                                        {/*esta linea tiene que ir acorde, agregar a las cards o lo q sea necesario*/}
                                        {books.books.map(post => (<li key={post.id}>{post.title} | {post.year} | {post.publisher}</li>))}
                                </ul>
                        }

                </div>

        )
}

export default PublicBooks
