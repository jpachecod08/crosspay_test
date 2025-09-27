// frontend/src/api/axios.js
import axios from "axios";

// baseURL se toma del .env de Vercel (VITE_API_URL) o localhost en dev
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
  headers: { "Content-Type": "application/json" },
});

// función para setear el token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
