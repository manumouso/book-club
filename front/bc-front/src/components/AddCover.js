import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styles from '../styles.css'



const AddCover = () => {

        const { register, handleSubmit } = useForm();
        const navigate = useNavigate();

        const [searchParams, setSearchParams] = useSearchParams();
        const idIngresada = searchParams.get("id");

        const onSubmit = async (data) => {

                const formData = new FormData();
                formData.append("file", data.file[0]);

                try {
                        const resp = await axios.post(`http://localhost:3333/covers/${idIngresada}`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('atoken')}` } });
                        if (resp.status === 201) return (
                                navigate('/MisLibros')
                        )
                        else if (resp.status === 401) return (
                                navigate('/Unauthorized')
                        )
                } catch (error) {
                        alert(error.response.data.message);
                }
        }

        return (
                <div className="bookCardStyle">
                        <div>
                                <Card sx={{
                                        width: 400,
                                        height: 400,
                                        backgroundColor: '#AED6F1',
                                        margin: 'auto',
                                }}>
                                        <CardContent >
                                                <br />
                                                <h2>Do you want to add a cover image? 🖼️</h2>
                                                <br />
                                                <h3>Please upload 👇</h3>
                                                <br />
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                        <div>
                                                                <label>File: </label>
                                                                <input type="file" {...register('file', {
                                                                        required: false
                                                                })} />
                                                        </div>
                                                        <br /><br />
                                                        <input className="buttonsCustom" type="submit" value='Upload' />
                                                </form>

                                        </CardContent>
                                        <CardActions>
                                                <Button href="/MisLibros" size="small">Back to my books</Button>
                                        </CardActions>
                                </Card>
                        </div>
                </div>
        )
}
export default AddCover