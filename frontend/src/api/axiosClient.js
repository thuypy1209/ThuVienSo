import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // URL Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động đính kèm Token vào Header nếu có
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Trả về trực tiếp data thay vì cả object response của axios
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error)
);

export default axiosClient;