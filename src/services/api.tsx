import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5000",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
});

export default api;