import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import '../css/HomePage.css'; // Dùng chung header
import '../css/ProfilePage.css'; 

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoading(true);
        // Gọi API /me. AxiosClient sẽ tự kẹp Token vào Header
        const res = await axiosClient.get('/auth/me'); 
        
        // Backend trả về req.user, ta hứng lấy
        setUserInfo(res.data || res); 
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        // Nếu Token hết hạn hoặc lỗi, đá user về trang Login
        localStorage.clear();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [navigate]);

  if (loading) return <div className="loading-screen">⏳ Đang tải hồ sơ ní ơi...</div>;

  return (
    <div className="profile-container">
      {/* HEADER TÁI SỬ DỤNG */}
      <header className="home-header">
        <div className="header-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <span style={{ fontSize: '26px' }}>🎓</span> THƯ VIỆN SỐ
        </div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
        </nav>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-big">
              {userInfo?.avatarUrl ? <img src={userInfo.avatarUrl} alt="Avatar" /> : "👤"}
            </div>
            <h2>{userInfo?.fullName || userInfo?.username}</h2>
            <span className="badge-role">{userInfo?.role?.name || 'Thành viên'}</span>
          </div>

          <div className="profile-details">
            <div className="info-item">
              <label>Tên đăng nhập:</label>
              <span>{userInfo?.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userInfo?.email || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <label>Ngày tham gia:</label>
              <span>{new Date(userInfo?.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="info-item">
              <label>Trạng thái tài khoản:</label>
              <span style={{color: 'green'}}>● Đang hoạt động</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-edit" onClick={() => alert("Tính năng đang phát triển!")}>
              ✍️ Chỉnh sửa thông tin
            </button>
            <button className="btn-logout-red" onClick={() => { localStorage.clear(); navigate('/login'); }}>
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;