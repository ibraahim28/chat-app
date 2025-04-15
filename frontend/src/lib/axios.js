import axios from "axios";
export const BASE_URL = "https://chat-app-backend-olive-two.vercel.app";
  console.log("BASE_URL==========", BASE_URL)
export const axiosInstance = axios.create({
  BASE_URL,
  withCredentials: true,
});
