import axios from 'axios';

const api = axios.create({
  baseURL: "https://31a07016-f9ea-4784-8e13-426c7b437e88.mock.pstmn.io" || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

{/* Optional: Attach token to every request automatically */}

// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token'); // or from cookies
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;
