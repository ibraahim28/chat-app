import axios from "axios";
export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/https://chat-app-backend-olive-two.vercel.app";
export const axiosInstance = axios.create({
  BASE_URL,
  withCredentials: true,
});
