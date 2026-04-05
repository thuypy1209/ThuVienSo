import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css'; // Xài ké CSS cho đẹp đồng bộ

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            // Lấy danh sách thả tim của chính user đang đăng nhập (nhờ có Token ở api.js)
            const res = await api.get('/wishlists');
            setWishlist(res.data.data || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách yêu thích:", err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm bỏ thả tim (Xóa khỏi Wishlist)
    const handleRemoveWishlist = async (wishlistId) => {
        try {
            await api.delete(`/wishlists/${wishlistId}`);
            // Xóa xong thì lọc nó ra khỏi màn hình luôn cho mượt
            setWishlist(wishlist.filter(item => item._id !== wishlistId));
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            alert("Có lỗi xảy ra khi xóa khỏi mục Yêu thích!");
        }
    };

    return (
        <div className="home-wrapper">
            {/* --- NAVBAR --- */}
            <nav className="navbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
                <div className="nav-logo">📖 HUTECH DigitalLib</div>
                <div className="nav-links" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontWeight: '500' }}>
                    <span onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span onClick={() => navigate('/borrow-history')}>📋 Lịch sử mượn</span>
                    {/* Đang ở trang Yêu thích nên cho nó đậm lên */}
                    <span className="active" style={{color: '#e74c3c', fontWeight: 'bold'}} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
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
                <h2 className="section-title">❤️ Tủ sách Yêu thích của bạn</h2>
                <p style={{color: '#666', marginBottom: '30px'}}>Những cuốn sách bạn đã đánh dấu để đọc sau sẽ nằm hết ở đây.</p>
                
                {loading ? <div className="loader">Đang mở tủ sách...</div> : (
                    <div className="book-grid">
                        {wishlist.length > 0 ? wishlist.map(item => {
                            const book = item.book; // Trích xuất thông tin cuốn sách từ object wishlist
                            if (!book) return null; // Đề phòng trường hợp sách đã bị Admin xóa khỏi hệ thống
                            
                            return (
                                <div key={item._id} className="book-card">
                                    <div className="book-thumb">
                                        <img src={book.coverImage || "https://via.placeholder.com/200x280?text=Sách+HUTECH"} alt={book.title} />
                                        <div className="overlay">
                                            <button onClick={() => navigate('/doc-sach')}>Đọc Ngay</button>
                                        </div>
                                    </div>
                                    <div className="book-meta">
                                        <h4 title={book.title}>{book.title}</h4>
                                        <p>✍️ {book.author?.name || "Tác giả ẩn danh"}</p>
                                        <button 
                                            style={removeBtnStyle}
                                            onClick={() => handleRemoveWishlist(item._id)}
                                        >
                                            💔 Bỏ yêu thích
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{textAlign: 'center', gridColumn: '1/-1', padding: '40px', fontSize: '16px'}}>
                                📭 Bạn chưa thả tim cuốn sách nào cả. Ra trang chủ khám phá thêm nhé!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// CSS nội tuyến cho nút Xóa
const removeBtnStyle = {
    marginTop: '10px',
    width: '100%',
    padding: '8px',
    background: '#fee',
    color: '#e74c3c',
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
};

export default Wishlist;