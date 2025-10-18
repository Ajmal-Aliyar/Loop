import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ROCKETCHAT_URL;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    console.log('Auth Token:', authToken);
    console.log('User ID:', userId);
    if (authToken && userId) {
      config.headers['X-Auth-Token'] = authToken;
      config.headers['X-User-Id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;
