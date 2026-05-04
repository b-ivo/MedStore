import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo') 
            ? JSON.parse(localStorage.getItem('userInfo')) 
            : null;
        
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
