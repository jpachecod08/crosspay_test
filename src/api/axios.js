import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {'Content-Type': 'application/json'}
});

export function setAuthToken(token){
  if(token) api.defaults.headers.common['Authorization'] = `Token ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;