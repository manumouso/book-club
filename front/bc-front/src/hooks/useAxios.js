import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from "react-router-dom";

const useAxios = (configObj) => {
        const {
                axiosInstance,
                method,
                url,
                requestConfig = {}
        } = configObj;

        const [response, setResponse] = useState([]);
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();

        useEffect(() => {
                //const controller = new AbortController;
                const fetchData = async () => {
                        try {
                                const res = await axiosInstance[method.toLowerCase()](url, {
                                        ...requestConfig,
                                        //signal: controller.signal
                                });
                                setResponse(res.data)
                        } catch (err) {
                                setError(err)
                                if (err.response.status === 401)
                                {
                                        navigate(`/Unauthorized`)
                                }
                        } finally {
                                setLoading(false)
                        }

                }
                fetchData()
                //return () => controller.abort();
        }, [])

        return [response, error, loading]
}

export default useAxios