import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:8082',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

export default instance;