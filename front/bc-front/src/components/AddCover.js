import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";



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
                        console.log(error);
                }
        }

        return (
                <div style={{ textAlign: 'center' }}>
                        <h2>Do you want to add a cover image? 🖼️</h2>
                        <h3>Please upload 👇</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                        <label>File: </label>
                                        <input type="file" {...register('file', {
                                                required: false
                                        })} />
                                </div>
                                <input type="submit" value='Upload' />
                                {/* <input type="submit" value='Not now' /> */}

                        </form>
                </div>
        )
}

export default AddCover