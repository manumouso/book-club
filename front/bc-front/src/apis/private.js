import axios from "axios";
const BASE_URL = '/'

export default axios.create({
        baseURL: BASE_URL,
        headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('atoken')}`
        }
});