import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const Bookshelf = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

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

    // --- API 1: THÊM VÀO YÊU THÍCH (WISHLIST) ---
    const handleWishlist = async (bookId) => {
        try {
            await api.post('/wishlists', { book: bookId });
            alert("❤️ Đã thêm vào tủ sách yêu thích!");
        } catch (error) {
            alert("Cuốn này ní đã thả tim rồi!");
        }
    };

    // --- API 2: THÊM VÀO GIỎ SÁCH (CART) ---
    const handleAddToCart = async (bookId) => {
        try {
            await api.post('/carts', { book: bookId });
            alert("🛒 Đã thêm vào giỏ sách chờ mượn!");
        } catch (error) {
            alert("Sách đã có trong giỏ rồi ní ơi!");
        }
    };

    // --- API 3: GỬI ĐÁNH GIÁ 5 SAO (REVIEWS) ---
    const handleRate = async (bookId, rating) => {
        try {
            await api.post('/reviews', { book: bookId, rating, comment: "Đánh giá từ tủ sách" });
            alert(`⭐ Đã gửi đánh giá ${rating} sao cho cuốn sách này!`);
        } catch (error) {
            alert("Ní đã đánh giá cuốn này rồi hoặc có lỗi xảy ra!");
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <nav className="navbar" style={navStyle}>
                <b style={{ fontSize: '24px', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>📚 HUTECH Library</b>
                <div className="nav-links">
                    <span onClick={() => navigate('/home')} style={{cursor: 'pointer', fontWeight: 'bold'}}>🏠 Về Trang Chủ</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#1a5f7a', marginBottom: '10px' }}>📖 Tủ Sách Điện Tử</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Chọn một cuốn sách để trải nghiệm đọc PDF trực tuyến.</p>

                {loading ? <div className="loader">Đang mở kho sách...</div> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
                        {books.map(book => (
                            <div key={book._id} style={shelfCardStyle}>
                                <div style={imgContainerStyle}>
                                    <img src={book.coverImage || "https://via.placeholder.com/200x280"} alt={book.title} style={bookImgStyle} />
                                    <div className="shelf-overlay" style={shelfOverlayStyle}>
                                        <button onClick={() => navigate(`/doc-sach/${book._id}`)} style={readNowBtnStyle}>📖 ĐỌC NGAY</button>
                                    </div>
                                </div>

                                <div style={{ padding: '15px' }}>
                                    <h4 style={bookTitleStyle} title={book.title}>{book.title}</h4>
                                    
                                    {/* PHẦN ĐÁNH GIÁ 5 SAO NHANH */}
                                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span 
                                                key={star} 
                                                onClick={() => handleRate(book._id, star)}
                                                style={{ cursor: 'pointer', fontSize: '20px', color: '#f39c12' }}
                                            >
                                                ☆
                                            </span>
                                        ))}
                                    </div>

                                    {/* CỤM NÚT TƯƠNG TÁC */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleWishlist(book._id)} style={wishBtnStyle}>❤️ Yêu thích</button>
                                        <button onClick={() => handleAddToCart(book._id)} style={cartBtnStyle}>🛒 Mượn sách</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS Nội tuyến (Việt có thể tách ra file CSS sau) ---
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 40px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const shelfCardStyle = { background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', transition: '0.3s' };
const imgContainerStyle = { position: 'relative', height: '320px', overflow: 'hidden' };
const bookImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const shelfOverlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(26, 95, 122, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: '0.3s' };
const readNowBtnStyle = { background: 'white', color: '#1a5f7a', border: 'none', padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const bookTitleStyle = { margin: '0 0 10px 0', fontSize: '17px', textAlign: 'center', color: '#333', fontWeight: '700' };
const wishBtnStyle = { flex: 1, background: '#fff0f0', color: '#e74c3c', border: '1px solid #ffcccc', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };
const cartBtnStyle = { flex: 1, background: '#eef6ff', color: '#3498db', border: '1px solid #d0e7ff', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

export default Bookshelf;