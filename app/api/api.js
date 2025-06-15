import axios from 'axios';

const api = axios.create({
  baseURL: "https://epilepsy-pa0n.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
