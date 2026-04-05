import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css'; // Kế thừa CSS của trang chủ

const PublishersList = () => {
    const navigate = useNavigate();
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                // Gọi API lấy dữ liệu thật từ Backend
                const res = await api.get('/publishers');
                setPublishers(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy NXB:", err);
                setError('Không thể kết nối đến máy chủ thư viện!');
            } finally {
                setLoading(false);
            }
        };
        fetchPublishers();
    }, []);

    return (
        <div className="home-wrapper">
            {/* --- NAVBAR --- */}
            <nav className="navbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
                <div className="nav-logo">📖 HUTECH DigitalLib</div>
                <div className="nav-links" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontWeight: '500' }}>
                    <span onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    {/* Bôi đậm NXB vì đang ở trang này */}
                    <span className="active" style={{color: '#004085', fontWeight: 'bold'}} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span onClick={() => navigate('/borrow-history')}>📋 Lịch sử mượn</span>
                    <span onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>
                <div className="nav-user">
                    <span>Chào, <b>{userInfo.fullName || 'Bạn'}</b></span>
                    <button className="btn-logout" onClick={() => {localStorage.clear(); navigate('/')}}>Thoát</button>
                </div>
            </nav>

            {/* --- NỘI DUNG CHÍNH --- */}
            <div className="container" style={{ marginTop: '30px' }}>
                <h2 className="section-title">🏢 Đối tác Nhà Xuất Bản</h2>
                <p style={{color: '#666', marginBottom: '30px'}}>Danh sách các nhà xuất bản đang cung cấp tài liệu cho hệ thống thư viện.</p>
                
                {loading && <div className="loader">Đang tải danh sách NXB...</div>}
                {error && <div style={{ color: 'red', padding: '20px', background: '#fee' }}>{error}</div>}
                
                {!loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {publishers.length > 0 ? publishers.map(pub => (
                            <div key={pub._id} style={pubCardStyle}>
                                <div style={iconWrapperStyle}>📚</div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>
                                    {pub.name}
                                </h3>
                                
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📍</span> {pub.address || 'Đang cập nhật địa chỉ...'}
                                </p>
                                
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🌐</span> 
                                    {pub.website ? (
                                        <a href={pub.website.startsWith('http') ? pub.website : `https://${pub.website}`} 
                                           target="_blank" rel="noreferrer" 
                                           style={{ color: '#007bff', textDecoration: 'none' }}>
                                            {pub.website}
                                        </a>
                                    ) : (
                                        'Chưa có website'
                                    )}
                                </p>
                            </div>
                        )) : (
                            <p style={{textAlign: 'center', gridColumn: '1/-1'}}>Hệ thống chưa có dữ liệu Nhà xuất bản nào.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS Trực tiếp cho các Thẻ NXB ---
const pubCardStyle = {
    background: 'white', padding: '20px', borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #28a745',
    transition: 'transform 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column'
};

const iconWrapperStyle = {
    width: '40px', height: '40px', background: '#e9ecef', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', marginBottom: '15px'
};

export default PublishersList;