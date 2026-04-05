import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {
                username: formData.username,
                password: formData.password
            });
            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo));
                setMessage("✅ Đăng nhập thành công!");
                setTimeout(() => navigate('/home'), 1000);
            }
        } catch (err) {
            setMessage("❌ " + (err.response?.data?.message || "Lỗi đăng nhập"));
        }
    };

    // --- XỬ LÝ ĐĂNG KÝ ---
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users', {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email,
                role: "Độc giả"
            });
            if (res.data.success) {
                setMessage("Đăng ký thành công! Mời bạn đăng nhập.");
                setIsLogin(true);
            }
        } catch (err) {
            setMessage("" + (err.response?.data?.message || "Lỗi đăng ký"));
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h1>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h1>
            
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {/* Luôn luôn cần Username & Password */}
                <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required style={inputStyle} />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required style={inputStyle} />

                {/* Nếu là Đăng ký thì hiện thêm Họ tên & Email */}
                {!isLogin && (
                    <>
                        <input type="text" name="fullName" placeholder="Họ và tên" onChange={handleChange} required style={inputStyle} />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
                    </>
                )}

                <button type="submit" style={btnStyle}>
                    {isLogin ? "Đăng nhập ngay" : "Tạo tài khoản"}
                </button>
            </form>

            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue', marginTop: '15px' }}>
                {isLogin ? "Chưa có tài khoản? Đăng ký tại đây" : "Đã có tài khoản? Đăng nhập ngay"}
            </p>

            {message && <div style={{ marginTop: '20px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</div>}
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default AuthPage;