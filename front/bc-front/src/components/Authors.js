import useAxios from '../hooks/useAxios'
import axios from "../apis/publics";

const Authors = () => {

        const [authors, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/authors',
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
                        <h2>Authors</h2>
                        {loading && <p>Loading...</p>}

                        {!loading && error && <p className='errMsg'>{error}</p>}

                        {!loading && !error && authors &&
                                <ul>
                                        {/*esta linea tiene que ir acorde, agregar a las cards o lo q sea necesario*/}
                                        {authors.authors.map(post => (<li key={post.id}>{post.firstName} {post.lastName}</li>))}
                                </ul>
                        }

                </div>

        )
}

export default Authors
