import axios from 'axios'
export const axiosInstance = axios.create({
    BASE_URL,
    withCredentials : true,
})

export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"