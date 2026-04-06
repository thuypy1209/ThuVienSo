import axios from 'axios';

// Tạo một trạm phát sóng gọi thẳng vào Backend thật của bạn
const api = axios.create({
    baseURL: 'http://localhost:3000', // Đổi từ 3000 sang 3069 vì backend chạy trên port này
});

// Phép thuật Cấp Quyền: Tự động nhét Token vào mọi API gửi đi
api.interceptors.request.use((config) => {
    // Thò tay vào túi (localStorage) lấy chìa khóa ra
    const token = localStorage.getItem('token');
    
    // Nếu có chìa khóa thì kẹp nó vào phần Headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const BASE_URL = 'http://localhost:3000';
export default api;