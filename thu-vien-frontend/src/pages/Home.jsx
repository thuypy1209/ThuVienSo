import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css'; // Đảm bảo file CSS này vẫn tồn tại

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [displayBooks, setDisplayBooks] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('all'); 
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCats = await api.get('/categories');
                setCategories(resCats.data.data || []);

                const resBooks = await api.get('/books');
                const allBooks = resBooks.data.data || [];
                setBooks(allBooks);
                setDisplayBooks(allBooks);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLike = async (bookId) => {
        try {
            await api.post('/wishlists', { book: bookId });
            alert("❤️ Đã thêm vào tủ sách yêu thích!");
        } catch (error) {
            alert("Sách này đã có trong tủ rồi ní ơi!");
        }
    };

    const handleCategoryClick = (catId) => {
        setSelectedCat(catId);
        if (catId === 'all') {
            setDisplayBooks(books);
        } else {
            const filtered = books.filter(book => 
                book.category === catId || book.category?._id === catId
            );
            setDisplayBooks(filtered);
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* --- NAVBAR CHUYÊN NGHIỆP --- */}
            <nav className="navbar" style={navStyle}>
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                
                <div className="nav-links" style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#4a4a4a' }}>
                    <span style={linkStyle} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={linkStyle} onClick={() => navigate('/tu-sach')}>📚 Tủ Sách Ebook</span>
                    <span style={linkStyle} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={linkStyle} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={linkStyle} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={linkStyle} onClick={() => navigate('/borrow-history')}>📋 Mượn sách</span>
                    <span style={linkStyle} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span style={linkStyle} onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span style={linkStyle} onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>

                <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '500', color: '#333' }}>Xin chào, <span style={{ color: '#1a5f7a', fontWeight: 'bold' }}>{userInfo.fullName || 'Bạn'}</span></span>
                    <button onClick={() => {localStorage.clear(); navigate('/')}} style={logoutBtnStyle}>Đăng xuất</button>
                </div>
            </nav>

            {/* --- HERO BANNER --- */}
            <header style={heroStyle}>
                <div style={heroOverlayStyle}>
                    <div style={{ zIndex: 2, textAlign: 'center', color: 'white', maxWidth: '800px', padding: '0 20px' }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Khám Phá Tri Thức Vô Tận</h1>
                        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>Hàng ngàn đầu sách từ giáo trình đến tài liệu tham khảo đang chờ bạn.</p>
                        
                        <div style={searchBoxStyle}>
                            <input 
                                type="text" 
                                placeholder="🔍 Tìm kiếm tựa sách, tác giả..." 
                                style={searchInputStyle}
                                onChange={(e) => {
                                    const term = e.target.value.toLowerCase();
                                    const searched = books.filter(b => b.title.toLowerCase().includes(term));
                                    setDisplayBooks(searched);
                                }} 
                            />
                            <button style={searchBtnStyle}>Tìm ngay</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                
                {/* THANH DANH MỤC */}
                <div style={{ marginBottom: '30px', borderBottom: '2px solid #eaeaea', paddingBottom: '15px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Phân loại tài liệu</h3>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                        <span 
                            style={selectedCat === 'all' ? catActiveStyle : catStyle}
                            onClick={() => handleCategoryClick('all')}
                        >
                            🌟 Tất cả
                        </span>
                        {categories.map(cat => (
                            <span 
                                key={cat._id} 
                                style={selectedCat === cat._id ? catActiveStyle : catStyle}
                                onClick={() => handleCategoryClick(cat._id)}
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                </div>

                <h2 style={{ fontSize: '28px', color: '#1a5f7a', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {selectedCat === 'all' ? '🔥 Sách Nổi Bật Mới Nhất' : `📁 Thể loại: ${categories.find(c => c._id === selectedCat)?.name || ''}`}
                </h2>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
                        ⏳ Đang tải dữ liệu từ thư viện...
                    </div>
                ) : (
                    <div style={gridStyle}>
                        {displayBooks.length > 0 ? displayBooks.map(book => (
                            <div key={book._id} style={cardStyle}>
                                <div style={thumbContainerStyle}>
                                    <img 
                                        src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"} 
                                        alt={book.title} 
                                        style={imgStyle}
                                    />
                                    {/* Nút Đọc Ngay hiện lên khi Hover */}
                                    <div className="overlay-btn" style={overlayStyle}>
                                        <button onClick={() => navigate('/doc-sach')} style={readBtnStyle}>📖 Đọc Ngay</button>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '15px' }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#222', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={book.title}>
                                        {book.title}
                                    </h4>
                                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '13px' }}>
                                        ✍️ {book.author?.name || "Tác giả ẩn danh"}
                                    </p>
                                    
                                    <button 
                                        onClick={() => handleLike(book._id)}
                                        style={likeBtnStyle}
                                        onMouseOver={(e) => e.target.style.background = '#ffcdd2'}
                                        onMouseOut={(e) => e.target.style.background = '#ffebee'}
                                    >
                                        ❤️ Thêm Yêu Thích
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '10px', color: '#888' }}>
                                <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>📚</span>
                                Hiện chưa có tựa sách nào trong thư mục này.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

// ==========================================
// CÁC OBJECT CSS NỘI TUYẾN ĐỂ LÀM ĐẸP GIAO DIỆN
// ==========================================

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const linkStyle = { cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };

const heroStyle = { 
    height: '450px', 
    backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop")', 
    backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' 
};
const heroOverlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(26, 95, 122, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center' };

const searchBoxStyle = { display: 'flex', width: '100%', maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '30px', padding: '5px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' };
const searchInputStyle = { flex: 1, border: 'none', padding: '15px 20px', fontSize: '16px', borderRadius: '30px', outline: 'none' };
const searchBtnStyle = { backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '0 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '25px', cursor: 'pointer' };

const catStyle = { padding: '8px 20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap', color: '#555', transition: '0.2s' };
const catActiveStyle = { ...catStyle, backgroundColor: '#1a5f7a', color: 'white', borderColor: '#1a5f7a', fontWeight: 'bold' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s' };
const thumbContainerStyle = { position: 'relative', height: '300px', backgroundColor: '#eee', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const overlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.3s' };
const readBtnStyle = { backgroundColor: 'white', color: '#1a5f7a', border: 'none', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' };

const likeBtnStyle = { background: '#ffebee', color: '#e74c3c', border: '1px solid #ffcdd2', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s' };

export default Home;