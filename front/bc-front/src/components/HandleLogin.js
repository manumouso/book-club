import useAxios from '../hooks/useAxios'
import axios from "../apis/publics";
import { useState } from 'react';




const HandleLogin = async (email, pass) => {

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [user, setUser] = useState(null)

        try {
                const { data } = await axios({
                        method: 'post',
                        url: 'http://localhost:3333/auth/signin',
                        data: {
                                "email": email,
                                "password": pass
                        }
                });

                console.log(data)
                console.log(username)
                console.log(password)

                setUser(user)
                setPassword('')
                setUsername('')
        } catch (e) {
                console.log('No se pudo hacer el fetch correctamente')
        }
}

export default HandleLogin