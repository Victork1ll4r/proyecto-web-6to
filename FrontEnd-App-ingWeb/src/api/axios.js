import axios from 'axios';  

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 150000,
    headers: {
        "Content-type": "application/json",
    }
});
export default api;