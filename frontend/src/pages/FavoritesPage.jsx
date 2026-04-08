// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/FavoritesPage.css';
import '../css/HomePage.css'; 
import '../css/BookPage.css'; 
import bannerImg from '../assets/library-bg.jpg';
import axiosClient from '../api/axiosClient'; // ✅ Dùng hàng hiệu axiosClient

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  // 1. GỌI API LẤY DANH SÁCH YÊU THÍCH (WISHList)
  const fetchFavorites = async () => {
    if (!user._id) {
        navigate('/login');
        return;
    }
    setLoading(true);
    try {
      // Gọi đúng API Backend Node: /wishlists/user/:userId
      const res = await axiosClient.get(`/wishlists/user/${user._id}`);
      // Backend return data trực tiếp nhờ interceptor
      setFavorites(res.data || res || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // 2. TẠO DANH SÁCH DROPDOWN TỰ ĐỘNG
  const uniqueAuthors = [...new Set(favorites.map(fav => fav.book?.author).filter(Boolean))];
  const uniqueCategories = [...new Set(favorites.map(fav => fav.book?.category).filter(Boolean))];

  // 3. HÀM LỌC SÁCH
  const filteredFavorites = favorites.filter(fav => {
    const book = fav.book;
    if (!book) return false;

    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAuthor = filterAuthor === '' || book.author === filterAuthor;
    const matchCategory = filterCategory === '' || book.category === filterCategory;

    return matchSearch && matchAuthor && matchCategory;
  });

  // 4. HÀM XÓA KHỎI DANH SÁCH YÊU THÍCH
  const handleRemoveFavorite = async (wishlistId) => {
    if(!window.confirm("Ní có chắc muốn bỏ thả tim cuốn sách này không?")) return;
    
    try {
      // Ở Backend Node, ta xóa theo ID của bản ghi wishlist
      await axiosClient.delete(`/wishlists/${wishlistId}`);
      // Cập nhật lại giao diện ngay lập tức
      setFavorites(favorites.filter(fav => fav._id !== wishlistId));
    } catch (err) {
      console.error("Lỗi khi xóa yêu thích:", err);
      alert("Không thể bỏ yêu thích lúc này, ní thử lại sau nhé!");
    }
  };

  return (
    <div className="favorites-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-logo">🎓 HUTECH DIGILIB</div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites" className="active">Sách yêu thích</Link>
          <Link to="/history">Lịch sử đọc</Link>
        </nav>
        <div className="header-actions">
          <div className="user-profile" onClick={() => navigate('/home')}>
            <div className="user-avatar">👤</div>
            <span>{user.fullName || "Thành viên"}</span>
          </div>
        </div>
      </header>

      <section 
        className="book-banner"
        style={{ 
          backgroundImage: `url(${bannerImg})`, 
          backgroundSize: 'cover',
          padding: '50px 20px' 
        }}
      >
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm trong kho báu của ní..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn-icon">🔍</button>
        </div>

        <div className="dropdown-filters">
          <div className="select-container">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
              <option value="">Chọn chủ đề</option>
              {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterCategory('')}>✕</button>
          </div>

          <div className="select-container">
            <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} className="filter-select">
              <option value="">Chọn tác giả</option>
              {uniqueAuthors.map((a, i) => <option key={i} value={a}>{a}</option>)}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterAuthor('')}>✕</button>
          </div>
        </div>
      </section>

      {/* DANH SÁCH HIỂN THỊ */}
      <section className="favorites-content">
        {loading ? (
          <h2 style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang lục lại kho báu...</h2>
        ) : filteredFavorites.length > 0 ? (
          <div className="favorites-grid">
            {filteredFavorites.map((fav) => {
              const book = fav.book;
              if (!book) return null;
              const thumbnail = book.imageLink || book.image_link || 'https://placehold.co/150x200';

              return (
                <div className="favorite-card" key={fav._id}>
                  <button 
                    className="btn-remove-fav" 
                    onClick={() => handleRemoveFavorite(fav._id)}
                    title="Bỏ yêu thích"
                  >
                    💔
                  </button>

                  <img src={thumbnail} alt={book.title} className="book-cover-large" />
                  
                  <div className="book-details">
                    <h3 title={book.title}>{book.title}</h3>
                    <p>{book.author || 'Chưa rõ tác giả'}</p>
                    
                    <button 
                      className="btn-read" 
                      onClick={() => navigate(`/read/${book._id || book.id}`)}
                    >
                      📖 Đọc Tiếp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-favorites" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>{favorites.length === 0 ? "💔 Kho báu đang trống!" : "📭 Không tìm thấy sách khớp!"}</h2>
            <Link to="/books" className="btn-go-books" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', borderRadius: '5px' }}>
                Khám phá Tủ Sách ngay ➔
            </Link>
          </div>
        )}
      </section>

      <footer className="site-footer" style={{marginTop: '50px'}}>
        <div className="footer-content" style={{textAlign: 'center', color: '#666'}}>
            <p>🎓 HUTECH DIGILIB - Chúc ní đọc sách vui vẻ!</p>
        </div>
      </footer>
    </div>
  );
};

export default FavoritesPage;