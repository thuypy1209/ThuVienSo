// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/App.css'; 
import axiosClient from '../api/axiosClient'; // SỬ DỤNG AXIOS CLIENT ĐỂ GỌI API NODE.JS

import nenThuVien from '../assets/nen-thuvien.jpg'; 

const LogoBig = () => (
  <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
    <span style={{ fontSize: '30px' }}>🎓</span> HUTECH Edu THƯ VIỆN SỐ
  </div>
);

const LogoVnEduSmall = () => (
  <span style={{ color: '#004085', fontWeight: 'bold', fontSize: '14px' }}>vnEdu 🎓</span>
);

const AuthPage = () => {
  const navigate = useNavigate(); 

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState(''); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Đổi regFullName thành regUsername cho khớp với schema Backend Node.js
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  // --- HÀM XỬ LÝ ĐĂNG NHẬP (NODE.JS) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Gọi API Login của Node.js
      const response = await axiosClient.post('/auth/login', { 
        username: loginUsername, 
        password: loginPassword 
      });
      const data = response;

      // Node.js trả về token, lưu vào localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("✅ Đăng nhập thành công! Đang chuyển hướng...");
      setIsSuccess(true);

      // Đợi 1 giây rồi bay sang trang chủ (đổi /home thành / nếu bạn map HomePage vào '/')
      setTimeout(() => {
          navigate('/home'); 
      }, 1000);

    } catch (error) {
      // Bắt lỗi từ backend trả về
      setMessage("🚨 Lỗi: " + (error?.message || error || "Sai tên đăng nhập hoặc mật khẩu!"));
      setIsSuccess(false);
    }
  }

  // --- HÀM XỬ LÝ ĐĂNG KÝ (NODE.JS) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (regPassword !== regConfirmPassword) {
      setMessage("🚨 Lỗi: Mật khẩu nhập lại không khớp!");
      setIsSuccess(false);
      return;
    }

    try {
      // Gọi API Register của Node.js
      await axiosClient.post('/auth/register', { 
        username: regUsername, 
        email: regEmail, 
        password: regPassword 
      });
      
      setMessage("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      setIsSuccess(true);

      // Xóa trắng form khi thành công
      setRegUsername(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword('');
      
    } catch (error) {
      // Xử lý chuỗi lỗi từ express-validator (nếu có mảng lỗi)
      let errorMsg = "🚨 Lỗi: Đăng ký thất bại!";
      if (Array.isArray(error)) {
          errorMsg = "🚨 Lỗi: " + error.map(e => Object.values(e)[0]).join(', ');
      } else if (error?.message) {
          errorMsg = "🚨 Lỗi: " + error.message;
      }
      setMessage(errorMsg);
      setIsSuccess(false);
    }
  }

  const renderLoginForm = () => (
    <div className="login-form-wrapper">
      <h1 className="login-title">ĐĂNG NHẬP</h1>
      <p className="welcome-text">Chào mừng bạn đến với hệ thống Trường Thư viện số HUTECH Edu DigiLib</p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>Tên đăng nhập *</label>
          <div className="input-with-icon">
            <span className="icon">👤</span>
            <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Nhập tên đăng nhập" required />
          </div>
        </div>
        <div className="input-group">
          <label>Mật khẩu *</label>
          <div className="input-with-icon">
            <span className="icon">🔒</span>
            <input type={isPasswordVisible ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
            <span className="toggle-icon" onClick={togglePasswordVisibility}>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</span>
          </div>
        </div>
        <div className="forgot-password-link"><a href="#">Quên mật khẩu?</a></div>
        <button type="submit" className="login-button">ĐĂNG NHẬP</button>
        <div className="or-divider"><span>Hoặc</span></div>
        <button type="button" className="vnedu-button">TÀI KHOẢN vnEdu  </button>
      </form>
      <div className="register-link">
        Bạn chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(false); setMessage(''); }}>Đăng ký</a>
      </div>
      <p className="legal-text">Đăng nhập nghĩa là bạn đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách sử dụng</a>.</p>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="register-form-wrapper">
      <button className="back-to-login" onClick={() => { setIsLoginMode(true); setMessage(''); }}>
        ⬅ Quay lại Đăng nhập
      </button>
      <h1 className="login-title">ĐĂNG KÝ</h1>
      <p className="welcome-text">Chào mừng bạn đến với hệ thống Trường Thư viện số vnEdu DigiLib</p>
      <form onSubmit={handleRegister} className="login-form register-form-grid">
        <div className="input-group">
          <label>Tên đăng nhập (*)</label>
          <div className="input-with-icon">
            <span className="icon">👤</span>
            <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="Nhập tên đăng nhập (không dấu)" required />
          </div>
        </div>
        <div className="input-group">
          <label>Email (*)</label>
          <div className="input-with-icon">
            <span className="icon">✉️</span>
            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Nhập email" required />
          </div>
        </div>
        <div className="input-group">
          <label>Mật khẩu (*)</label>
          <div className="input-with-icon">
            <span className="icon">🔒</span>
            <input type={isPasswordVisible ? 'text' : 'password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
            <span className="toggle-icon" onClick={togglePasswordVisibility}>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</span>
          </div>
        </div>
        <div className="input-group">
          <label>Nhập lại mật khẩu (*)</label>
          <div className="input-with-icon">
            <span className="icon">🔒</span>
            <input type={isPasswordVisible ? 'text' : 'password'} value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} placeholder="Mật khẩu nhập lại" required />
          </div>
        </div>
        <div className="input-group full-width" style={{marginTop: '10px'}}>
          <button type="submit" className="login-button">ĐĂNG KÝ TÀI KHOẢN</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-left" style={{ backgroundImage: `url(${nenThuVien})` }}>
        <div className="logo-section"><LogoBig /></div>
      </div>
      <div className="login-right">
        {isLoginMode ? renderLoginForm() : renderRegisterForm()}
        
        {message && (
          <div className={`message full-width ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;