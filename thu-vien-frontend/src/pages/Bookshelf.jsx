import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const Bookshelf = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRatings, setUserRatings] = useState({});

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const res = await api.get('/books');
                setBooks(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy tủ sách:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEbooks();
    }, []);

    const handleWishlist = async (bookId) => {
        if (!userId) return alert("⚠️ Ní chưa đăng nhập!");
        try {
            await api.post('/wishlists', { book: bookId, user: userId });
            alert("❤️ Đã thêm vào tủ sách yêu thích!");
        } catch (error) {
            alert(error.response?.data?.message || "❌ Lỗi Server!");
        }
    };

    const handleAddToCart = async (bookId) => {
        if (!userId) return alert("⚠️ Ní chưa đăng nhập!");
        try {
            await api.post('/carts', {
                user: userId,
                book: bookId,
                quantity: 1
            });
            alert("🛒 Đã thêm vào giỏ hàng!");
        } catch (error) {
            alert(error.response?.data?.message || "❌ Lỗi Server!");
        }
    };

    const handleRate = async (bookId, rating) => {
        if (!userId) return alert("⚠️ Ní chưa đăng nhập!");
        try {
            await api.post('/reviews', { book: bookId, rating, comment: "Đánh giá từ tủ sách", user: userId });
            setUserRatings(prev => ({ ...prev, [bookId]: rating }));
            alert(`⭐ Đã gửi đánh giá ${rating} sao cho cuốn sách này!`);
        } catch (error) {
            alert(error.response?.data?.message || "❌ Lỗi Server: Đánh giá thất bại!");
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <nav className="navbar" style={navStyle}>
                <b style={{ fontSize: '24px', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>📚 HUTECH Library</b>
                <div className="nav-links">
                    <span onClick={() => navigate('/admin/add-book')} style={{cursor: 'pointer', fontWeight: 'bold', color: '#e67e22', marginRight: '15px'}}>⚙️ Quản lý Sách</span>
                    <span onClick={() => navigate('/home')} style={{cursor: 'pointer', fontWeight: 'bold'}}>🏠 Về Trang Chủ</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#1a5f7a', marginBottom: '10px' }}>📖 Tủ Sách Điện Tử</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Chọn một cuốn sách để trải nghiệm đọc PDF trực tuyến.</p>

                {loading ? <div className="loader">Đang mở kho sách...</div> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
                        {books.map(book => {
                            const currentStars = userRatings[book._id] || book.averageRating || 0;
                            const imageUrl = book.coverImage 
                                ? `http://localhost:3000${book.coverImage}` 
                                : "https://placehold.co/200x280?text=Sách+HUTECH";

                            return (
                                <div key={book._id} style={shelfCardStyle}>
                                    <div style={imgContainerStyle}>
                                        <img src={imageUrl} alt={book.title} style={bookImgStyle} />
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={bookTitleStyle} title={book.title}>{book.title}</h4>
                                        <p style={{textAlign: 'center', color: '#666', fontSize: '14px', margin: '4px 0'}}>
                                            ✍️ {book.author}
                                        </p>

                                        {/* === GIÁ TIỀN + KHO === */}
                                        <div style={{ textAlign: 'center', margin: '8px 0' }}>
                                            <span style={{ 
                                                fontSize: '18px', 
                                                fontWeight: 'bold', 
                                                color: '#e74c3c' 
                                            }}>
                                                {book.price 
                                                    ? `${book.price.toLocaleString('vi-VN')} ₫` 
                                                    : 'Chưa có giá'}
                                            </span>
                                            {book.stock !== undefined && (
                                                <span style={{ 
                                                    fontSize: '13px', 
                                                    color: book.stock > 0 ? '#28a745' : '#e74c3c',
                                                    marginLeft: '10px'
                                                }}>
                                                    | Còn {book.stock} cuốn
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    onClick={() => handleRate(book._id, star)}
                                                    style={{ cursor: 'pointer', fontSize: '24px', color: star <= currentStars ? '#f39c12' : '#ccc', transition: '0.2s' }}
                                                >
                                                    {star <= currentStars ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>

                                        <button onClick={() => navigate(`/doc-sach/${book._id}`)} style={readNowBtnStyle}>
                                            📖 ĐỌC NGAY PDF
                                        </button>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button onClick={() => handleWishlist(book._id)} style={wishBtnStyle}>❤️ Yêu thích</button>
                                            <button onClick={() => handleAddToCart(book._id)} style={cartBtnStyle}>🛒 Thêm vào giỏ</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS Nội tuyến ---
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 40px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const shelfCardStyle = { background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', transition: '0.3s' };
const imgContainerStyle = { height: '300px', overflow: 'hidden', borderBottom: '1px solid #eee' };
const bookImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const readNowBtnStyle = { width: '100%', background: '#1a5f7a', color: 'white', border: 'none', padding: '10px 0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' };
const bookTitleStyle = { margin: '0 0 5px 0', fontSize: '17px', textAlign: 'center', color: '#333', fontWeight: '700' };
const wishBtnStyle = { flex: 1, background: '#fff0f0', color: '#e74c3c', border: '1px solid #ffcccc', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };
const cartBtnStyle = { flex: 1, background: '#eef6ff', color: '#3498db', border: '1px solid #d0e7ff', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

export default Bookshelf;