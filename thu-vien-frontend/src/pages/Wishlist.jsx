import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css'; 

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        if (!userId) {
            console.error("Không tìm thấy ID người dùng!");
            setLoading(false);
            return;
        }

        try {
            const res = await api.get(`/wishlists/${userId}`);
            setWishlist(res.data.data || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách yêu thích:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveWishlist = async (wishlistId) => {
        try {
            await api.delete(`/wishlists/${wishlistId}`);
            setWishlist(wishlist.filter(item => item._id !== wishlistId));
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            alert("Có lỗi xảy ra khi xóa khỏi mục Yêu thích!");
        }
    };

    return (
        <div className="home-wrapper">
            <nav className="navbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
                <div className="nav-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/home')}>📖 HUTECH DigitalLib</div>
                <div className="nav-links" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontWeight: '500' }}>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/borrow-history')}>📋 Lịch sử mượn</span>
                    <span style={{color: '#e74c3c', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>
                <div className="nav-user">
                    <span>Chào, <b>{userInfo.fullName || userInfo?.user?.fullName || 'Bạn'}</b></span>
                    <button className="btn-logout" onClick={() => {localStorage.clear(); navigate('/')}}>Thoát</button>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '30px' }}>
                <h2 className="section-title">❤️ Tủ sách Yêu thích của bạn</h2>
                <p style={{color: '#666', marginBottom: '30px'}}>Những cuốn sách bạn đã đánh dấu để đọc sau sẽ nằm hết ở đây.</p>
                
                {loading ? <div className="loader">Đang mở tủ sách...</div> : (
                    <div className="book-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {wishlist.length > 0 ? wishlist.map(item => {
                            const book = item.book; 
                            if (!book) return null; 
                            
                            return (
                                <div key={item._id} className="book-card" style={{background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                                    <div className="book-thumb" style={{position: 'relative', overflow: 'hidden', borderRadius: '8px'}}>
                                        <img src={book.coverImage || "https://via.placeholder.com/200x280.png?text=Sách+HUTECH"} alt={book.title} style={{width: '100%', height: '250px', objectFit: 'cover'}} />
                                        <div className="overlay">
                                            <button onClick={() => navigate(`/doc-sach/${book._id}`)}>Đọc Ngay</button>
                                        </div>
                                    </div>
                                    <div className="book-meta" style={{textAlign: 'center', marginTop: '10px'}}>
                                        <h4 title={book.title} style={{fontSize: '16px', margin: '5px 0'}}>{book.title}</h4>
                                        <p style={{fontSize: '14px', color: '#777'}}>✍️ {book.author?.name || "Tác giả ẩn danh"}</p>
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