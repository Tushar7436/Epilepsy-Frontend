import axios from 'axios';

const api = axios.create({
  baseURL: "https://epilepsy-api-gateway.onrender.com/login",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
