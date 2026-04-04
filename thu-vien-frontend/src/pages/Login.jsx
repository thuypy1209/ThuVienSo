import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Lấy đồ nghề chuyển trang ra
import api from '../utils/api'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate(); // 2. Bật công cụ chuyển trang

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            if (response.data.success) {
                const token = response.data.data.token;
                
                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(response.data.data.userInfo));

                setMessage("✅ Đăng nhập thành công! Đang chuyển vào thư viện...");
                console.log("Token lấy được là:", token);
                
                // 3. Phép thuật chuyển trang nằm ở đây: Đợi 1 giây rồi bay sang trang đọc sách
                setTimeout(() => {
                    navigate('/doc-sach');
                }, 1000);
            }
        } catch (error) {
            setMessage("❌ Lỗi: " + (error.response?.data?.message || "Không thể kết nối"));
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Đăng Nhập Thư Viện</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tài khoản: </label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Mật khẩu: </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Vào Thư Viện</button>
            </form>
            
            {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
};

export default Login;