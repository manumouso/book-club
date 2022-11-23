import useAxios from '../hooks/useAxios'
import axios from "../apis/publics";

const Genre = () => {

        const [genres, error, loading] = useAxios({
                axiosInstance: axios,
                method: 'GET',
                url: 'http://localhost:3333/genres',
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
                        <h2>Genres</h2>
                        {loading && <p>Loading...</p>}

                        {!loading && error && <p className='errMsg'>{error}</p>}

                        {!loading && !error && genres &&
                                <ul>
                                        {/*esta linea tiene que ir acorde, agregar a las cards o lo q sea necesario*/}
                                        {genres.genres.map(post => (<li key={post.id}>{post.name}</li>))}
                                </ul>
                        }

                </div>

        )
}

export default Genre
