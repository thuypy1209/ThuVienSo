// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/FavoritesPage.css';
import '../css/HomePage.css'; 
import '../css/BookPage.css'; 
// Nếu ní để CSS của thanh tìm kiếm ở App.css thì nhớ import nó vào nhé!
import bannerImg from '../assets/library-bg.jpg';

// 🎯 Email dùng để test 
const USER_EMAIL = "viet@gmail.com";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);

  // --- 1. THÊM CÁC BIẾN CHO THANH TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPublisher, setFilterPublisher] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // 2. GỌI API LẤY DANH SÁCH YÊU THÍCH
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/danhsach?email=${USER_EMAIL}`);
      const data = await response.json();
      setFavorites(data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // --- 3. TẠO DANH SÁCH DROPDOWN TỰ ĐỘNG (Lấy từ kho sách yêu thích) ---
  const uniqueAuthors = [...new Set(favorites.map(fav => fav.book?.author).filter(Boolean))];
  const uniqueCategories = [...new Set(favorites.map(fav => fav.book?.category).filter(Boolean))];
  const uniquePublishers = [...new Set(favorites.map(fav => fav.book?.publisher).filter(Boolean))];
  const uniqueLanguages = [...new Set(favorites.map(fav => fav.book?.language).filter(Boolean))];

  // --- 4. HÀM LỌC SÁCH YÊU THÍCH ---
  const filteredFavorites = favorites.filter(fav => {
    const book = fav.book;
    if (!book) return false;

    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchAuthor = filterAuthor === '' || book.author === filterAuthor;
    const matchCategory = filterCategory === '' || book.category === filterCategory;
    const matchPublisher = filterPublisher === '' || book.publisher === filterPublisher;
    const matchLanguage = filterLanguage === '' || book.language === filterLanguage;

    return matchSearch && matchAuthor && matchCategory && matchPublisher && matchLanguage;
  });

  // 5. HÀM XÓA SÁCH KHỎI DANH SÁCH YÊU THÍCH
  const handleRemoveFavorite = async (bookId) => {
    if(!window.confirm("Ní có chắc muốn bỏ thả tim cuốn sách này không?")) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: USER_EMAIL, bookId: bookId })
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.book.id !== bookId));
      }
    } catch (err) {
      console.error("Lỗi khi xóa yêu thích:", err);
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
          <div className="user-profile" onClick={() => navigate('/')}>
            <div className="user-avatar">👤</div><span>Ní Việt</span>
          </div>
        </div>
      </header>

     {/* --- BANNER TÌM KIẾM (ĐÃ FIX DẸP LÉP & HẾT ÁM TÍM) --- */}
      <section 
        className="book-banner"
        style={{ 
          backgroundImage: `url(${bannerImg})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '50px 20px' 
        }}
      >
        <div className="breadcrumb" style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          Trang chủ &gt; Sách yêu thích
        </div>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm kiếm trong kho báu của bạn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn-text">
            <span>⚲</span> Bộ lọc tìm kiếm
          </button>
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

          <div className="select-container">
            <select value={filterPublisher} onChange={(e) => setFilterPublisher(e.target.value)} className="filter-select">
              <option value="">Chọn nhà xuất bản</option>
              {uniquePublishers.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterPublisher('')}>✕</button>
          </div>

          <div className="select-container">
            <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="filter-select">
              <option value="">Chọn ngôn ngữ</option>
              {uniqueLanguages.map((l, i) => <option key={i} value={l}>{l}</option>)}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterLanguage('')}>✕</button>
          </div>
        </div>
      </section>

      {/* --- TAGS GỢI Ý & TIÊU ĐỀ ẤN PHẨM --- */}
      <section className="quick-tags-section">
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>THÍ NGHIỆM ẢO</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>BÀI GIẢNG KHAN</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>KHO SÁCH MONKEY</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>NXB GIÁO DỤC</button>
      </section>

      {/* DANH SÁCH HIỂN THỊ */}
      <section className="favorites-content">
        {loading ? (
          <h2 style={{ textAlign: 'center' }}>⏳ Đang lục lại kho báu...</h2>
        ) : filteredFavorites.length > 0 ? (
          <div className="favorites-grid">
            {filteredFavorites.map((fav) => {
              const book = fav.book;
              const thumbnail = book.image_link || book.imageLink || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

              return (
                <div className="favorite-card" key={fav.id}>
                  <button 
                    className="btn-remove-fav" 
                    onClick={() => handleRemoveFavorite(book.id)}
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
                      onClick={() => navigate(`/read/${book.id}`)}
                    >
                      📖 Đọc Tiếp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-favorites" style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
            <h2 style={{ color: '#555' }}>
               {favorites.length === 0 ? "💔 Tủ sách yêu thích của bạn đang trống!" : "📭 Không tìm thấy sách khớp với bộ lọc!"}
            </h2>
            <p style={{ color: '#888' }}>
               {favorites.length === 0 ? "Hãy dạo quanh Tủ Sách và thả tim cho những cuốn sách bạn tâm đắc nhé." : "Thử đổi từ khóa hoặc xóa bớt bộ lọc xem sao."}
            </p>
            <Link to="/books" className="btn-go-books" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', borderRadius: '5px' }}>
                Khám phá Tủ Sách ngay ➔
            </Link>
          </div>
        )}
      </section>
      {/* --- CHÂN TRANG (FOOTER) --- */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-col">
            <div className="footer-logo">
              <span style={{ fontSize: '28px' }}>🎓</span> HUTECH DIGILIB
            </div>
            <p>🏢 SỞ GIÁO DỤC VÀ ĐÀO TẠO (Đồ án HUTECH)</p>
            <p>🏠 Trường Thư viện số HUTECH DigiLib</p>
          </div>

          <div className="footer-col">
            <p>📍 Xóm Suối Cạn, Xã Phú Thượng, Tỉnh Thái Nguyên</p>
            <p>📞 0966827161</p>
            <p>✉️ minhandeptrainhat@gmail.com</p>
          </div>

          <div className="footer-col links-col">
            <p><span>ℹ️</span> Giới thiệu</p>
            <p><span>❓</span> Hướng dẫn sử dụng</p>
            <p><span>🛡️</span> Điều khoản sử dụng</p>
            <p><span>💬</span> Câu hỏi thường gặp</p>
            <p><span>👥</span> Liên hệ</p>
          </div>
        </div>

        
      </footer>
    </div>
  );
};

export default FavoritesPage;