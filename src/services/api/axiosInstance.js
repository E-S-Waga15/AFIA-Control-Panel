import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://afia.medlifesy.org/public/api',
  headers: {
  
  },
});

// Attach token if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
