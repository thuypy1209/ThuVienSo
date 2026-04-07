import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifs, setNotifs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        const fetchNotifs = async () => {
            if (!userId) {
                console.error("Không tìm thấy ID người dùng!");
                setLoading(false);
                return;
            }

            try {
                const dummyData = [
                    { _id: '1', title: 'Sách mới: Lập trình ReactJS', message: 'Hệ thống vừa cập nhật cuốn sách "Lập trình ReactJS từ số 0". Vào xem ngay!', type: 'newBook', isRead: false, createdAt: new Date() },
                    { _id: '2', title: 'Sắp đến hạn trả sách', message: 'Cuốn "Clean Code" của bạn sẽ hết hạn vào ngày mai. Vui lòng trả sách đúng hạn.', type: 'dueDate', isRead: false, createdAt: new Date(Date.now() - 86400000) },
                    { _id: '3', title: 'Mượn sách thành công', message: 'Bạn đã mượn thành công cuốn "Design Patterns".', type: 'system', isRead: true, createdAt: new Date(Date.now() - 172800000) },
                ];

                const res = await api.get(`/notifications/${userId}`);
                setNotifs(res.data.data?.length > 0 ? res.data.data : dummyData);
            } catch (err) {
                console.error("Lỗi lấy thông báo:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, [userId]);

    const markAsRead = async (id) => {
        try {
            setNotifs(notifs.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Lỗi cập nhật", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifs(notifs.map(n => ({ ...n, isRead: true })));
            alert("Đã đánh dấu tất cả là đã đọc!");
        } catch (error) {
             console.error("Lỗi cập nhật", error);
        }
    }

    const filteredNotifs = notifs.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'dueDate') return notif.type === 'dueDate';
        if (filter === 'newBook') return notif.type === 'newBook';
        return true; 
    });

    const getNotifStyle = (type) => {
        switch(type) {
            case 'dueDate': return { icon: '⏰', color: '#e74c3c', bg: '#ffebee' };
            case 'newBook': return { icon: '🆕', color: '#28a745', bg: '#e6f4ea' };
            case 'system': return { icon: '⚙️', color: '#6c757d', bg: '#f8f9fa' };
            default: return { icon: '🔔', color: '#007bff', bg: '#e6f2ff' };
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            <nav className="navbar" style={navStyle}>
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                <div className="nav-links" style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#4a4a4a' }}>
                    <span style={linkStyle} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={linkStyle} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={linkStyle} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={linkStyle} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={linkStyle} onClick={() => navigate('/borrow-history')}>📋 Mượn sách</span>
                    <span style={linkStyle} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span style={linkStyle} onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span style={{...linkStyle, color: '#1a5f7a', fontWeight: 'bold'}} onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>
                <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '500', color: '#333' }}>Xin chào, <span style={{ color: '#1a5f7a', fontWeight: 'bold' }}>{userInfo.fullName || userInfo?.user?.fullName || 'Bạn'}</span></span>
                    <button onClick={() => {localStorage.clear(); navigate('/')}} style={logoutBtnStyle}>Đăng xuất</button>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '40px', maxWidth: '850px', margin: '40px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #eaeaea', paddingBottom: '15px' }}>
                    <h2 style={{ fontSize: '28px', color: '#1a5f7a', margin: 0 }}>🔔 Trung tâm Thông báo</h2>
                    <button onClick={markAllAsRead} style={{ background: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                        ✔️ Đánh dấu tất cả đã đọc
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                    <button style={filter === 'all' ? activeTabStyle : tabStyle} onClick={() => setFilter('all')}>Tất cả</button>
                    <button style={filter === 'unread' ? activeTabStyle : tabStyle} onClick={() => setFilter('unread')}>Chưa đọc ({notifs.filter(n => !n.isRead).length})</button>
                    <button style={filter === 'dueDate' ? activeTabStyle : tabStyle} onClick={() => setFilter('dueDate')}>⏰ Nhắc hạn trả</button>
                    <button style={filter === 'newBook' ? activeTabStyle : tabStyle} onClick={() => setFilter('newBook')}>🆕 Sách mới</button>
                </div>

                {loading ? <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>⏳ Đang tải thông báo...</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {filteredNotifs.length > 0 ? filteredNotifs.map(notif => {
                            const styleData = getNotifStyle(notif.type);
                            
                            return (
                                <div 
                                    key={notif._id} 
                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                    style={{ 
                                        display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '20px', 
                                        background: notif.isRead ? '#fff' : '#f0f8ff', 
                                        border: notif.isRead ? '1px solid #eaeaea' : `1px solid ${styleData.color}40`,
                                        borderLeft: `5px solid ${notif.isRead ? '#ccc' : styleData.color}`, 
                                        borderRadius: '10px', cursor: notif.isRead ? 'default' : 'pointer', 
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: '0.2s'
                                    }}
                                >
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: styleData.bg, color: styleData.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', flexShrink: 0 }}>
                                        {styleData.icon}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <h4 style={{ margin: 0, color: notif.isRead ? '#555' : '#111', fontSize: '18px' }}>
                                                {notif.title}
                                            </h4>
                                            {!notif.isRead && <span style={{ width: '10px', height: '10px', background: '#007bff', borderRadius: '50%', display: 'inline-block' }}></span>}
                                        </div>
                                        
                                        <p style={{ margin: '0 0 10px 0', color: notif.isRead ? '#777' : '#333', fontSize: '15px', lineHeight: '1.5' }}>
                                            {notif.message}
                                        </p>
                                        
                                        <small style={{ color: '#999', fontSize: '13px' }}>
                                            🕒 {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                        </small>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '50px', display: 'block', marginBottom: '15px' }}>📭</span>
                                <p style={{ color: '#666', fontSize: '16px' }}>Bạn không có thông báo nào trong mục này.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const linkStyle = { cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };

const tabStyle = { padding: '10px 20px', background: 'white', border: '1px solid #ddd', borderRadius: '25px', cursor: 'pointer', color: '#555', fontWeight: '600', whiteSpace: 'nowrap', transition: '0.2s' };
const activeTabStyle = { ...tabStyle, background: '#1a5f7a', color: 'white', borderColor: '#1a5f7a' };

export default Notifications;