// src/pages/BookPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/BookPage.css'; 
import '../css/HomePage.css'; 
import bannerImg from '../assets/library-bg.jpg';

// 🚨 LƯU Ý QUAN TRỌNG: Email này PHẢI CÓ trong bảng 'users' của MySQL
const USER_EMAIL = "viet@gmail.com";

const BookPage = () => {
  
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);

  // Bộ State cho Thanh Tìm Kiếm & Lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPublisher, setFilterPublisher] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // --- THÊM STATE CHO TÍNH NĂNG VIP VÀ MOMO ---
  // Kiểm tra xem trình duyệt đã lưu thẻ VIP chưa
  const isUserVip = localStorage.getItem('isUserVip') === 'true';
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [targetVipBook, setTargetVipBook] = useState(null); 

  const fetchSafeJson = async (url) => {
    try {
      const response = await fetch(url);
      const text = await response.text(); 
      return text ? JSON.parse(text) : []; 
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const booksData = await fetchSafeJson('http://localhost:8080/api/books/danhsach');
      setBooks(booksData);

      const favsData = await fetchSafeJson(`http://localhost:8080/api/favorites/danhsach?email=${USER_EMAIL}`);
      setFavorites(favsData);

      const historyData = await fetchSafeJson(`http://localhost:8080/api/reading/danhsach?email=${USER_EMAIL}`);
      setRecentBooks(historyData);
      
      setLoading(false);
    };
    loadData();
  }, []);

  const handleToggleFavorite = async (bookId) => {
    try {
      const response = await fetch('http://localhost:8080/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: USER_EMAIL, bookId: bookId })
      });
      
      const message = await response.text(); 
      
      if (message.includes("Không tìm thấy tài khoản")) {
        alert("🚨 BÁO ĐỘNG ĐỎ: Ní chưa tạo tài khoản 'viet@gmail.com' trong bảng users của MySQL! Hãy mở MySQL thêm vào nhé.");
        return;
      }

      if (response.ok && !message.includes("Lỗi")) {
        const newData = await fetchSafeJson(`http://localhost:8080/api/favorites/danhsach?email=${USER_EMAIL}`);
        setFavorites(newData);
      } else {
        alert(message);
      }
    } catch (err) {
      alert("Lỗi kết nối Java!");
    }
  };

  // ==========================================
  // 1. HÀM XỬ LÝ KHI BẤM VÀO NGÔI SAO
  // ==========================================
  const handleRateBook = async (e, bookId, star) => {
    e.stopPropagation(); 
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}/rate?star=${star}`, { 
        method: 'POST' 
      });
      if (response.ok) {
        alert(`Cảm ơn ní đã đánh giá ${star} sao cho ấn phẩm này!`);
        const booksData = await fetchSafeJson('http://localhost:8080/api/books/danhsach');
        setBooks(booksData);
      }
    } catch (err) {
      console.log("Lỗi đánh giá:", err);
    }
  };

  // ==========================================
  // 2. HÀM VẼ 5 NGÔI SAO TƯƠNG TÁC
  // ==========================================
  const renderInteractiveStars = (book) => {
    const currentRating = book.rating || 0; 
    return (
      <div className="interactive-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star}
            className={`star-icon ${star <= Math.round(currentRating) ? 'filled' : 'empty'}`}
            onClick={(e) => handleRateBook(e, book.id, star)}
            title={`Đánh giá ${star} sao`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">({currentRating.toFixed(1)})</span>
      </div>
    );
  };

  // --- THUẬT TOÁN LỌC SÁCH ---
  const uniqueCategories = [...new Set(books.map(b => b.category).filter(Boolean))];
  const uniqueAuthors = [...new Set(books.map(b => b.author).filter(Boolean))];
  const uniquePublishers = [...new Set(books.map(b => b.publisher).filter(Boolean))];
  const uniqueLanguages = [...new Set(books.map(b => b.language).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchCat = filterCategory ? book.category === filterCategory : true;
    const matchAuth = filterAuthor ? book.author === filterAuthor : true;
    const matchPub = filterPublisher ? book.publisher === filterPublisher : true;
    const matchLang = filterLanguage ? book.language === filterLanguage : true;
    return matchSearch && matchCat && matchAuth && matchPub && matchLang;
  });

  return (
    <div className="book-page-container">
      <header className="home-header">
        <div className="header-logo">🎓 HUTECH DIGILIB</div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books" className="active">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
          <Link to="/history">Lịch sử đọc</Link>
        </nav>
      </header>

      {/* --- BANNER TÌM KIẾM --- */}
      {/* 👉 Dán trực tiếp style vào thẻ section này luôn */}
      <section 
        className="book-banner"
        style={{ 
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '50px 20px' /* Thêm dòng này để khung ảnh nó nở to ra, bao trọn cục tìm kiếm */
        }}
      >
        {/* Nội dung nằm TRỌN BÊN TRONG ảnh nền */}
        <div className="breadcrumb" style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          Trang chủ &gt; Ấn phẩm
        </div>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Nhập tên ấn phẩm cần tìm kiếm ..." 
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
              {/* Giả định biến uniqueCategories đã có */}
              {/* {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)} */}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterCategory('')}>✕</button>
          </div>

          <div className="select-container">
            <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} className="filter-select">
              <option value="">Chọn tác giả</option>
              {/* {uniqueAuthors.map((a, i) => <option key={i} value={a}>{a}</option>)} */}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterAuthor('')}>✕</button>
          </div>

          <div className="select-container">
            <select value={filterPublisher} onChange={(e) => setFilterPublisher(e.target.value)} className="filter-select">
              <option value="">Chọn nhà xuất bản</option>
              {/* {uniquePublishers.map((p, i) => <option key={i} value={p}>{p}</option>)} */}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterPublisher('')}>✕</button>
          </div>

          <div className="select-container">
            <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="filter-select">
              <option value="">Chọn ngôn ngữ</option>
              {/* {uniqueLanguages.map((l, i) => <option key={i} value={l}>{l}</option>)} */}
            </select>
            <button className="clear-select-btn" onClick={() => setFilterLanguage('')}>✕</button>
          </div>
        </div>
      </section>

      {/* --- TAGS GỢI Ý (Đã gắn sự kiện giả lập CHUA_CO_DATA) --- */}
      <section className="quick-tags-section">
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>THÍ NGHIỆM ẢO</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>BÀI GIẢNG KHAN</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>KHO SÁCH MONKEY</button>
        <button className="quick-tag" onClick={() => setFilterCategory('CHUA_CO_DATA')}>NXB GIÁO DỤC</button>
      </section>

      {/* --- KHU VỰC HIỂN THỊ SÁCH CHÍNH --- */}
      <section className="books-content">
        <div className="content-header">
          <h2>Ấn phẩm</h2>
          <div className="view-toggles">
            <button>🔲</button>
            <button>📄</button>
          </div>
        </div>

        {loading ? (
          <h3 style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang tải dữ liệu...</h3>
        ) : filteredBooks.length > 0 ? (
          // NẾU CÓ SÁCH: Hiển thị Grid
          <div className="books-grid">
            {filteredBooks.map((book) => {
              const title = book.title || 'Không có tiêu đề';
              const thumbnail = book.image_link || book.imageLink || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
              const isFav = favorites.some(f => f.book && f.book.id === book.id);

              return (
                <div className="book-card-item" key={book.id}>
                  <button onClick={() => handleToggleFavorite(book.id)} className="heart-btn">
                    {isFav ? '💜' : '🤍'}
                  </button>

                  <img src={thumbnail} alt={title} className="book-cover-large" />
                  <div className="book-details">
                    <h3 title={title}>{title}</h3>
                    <p>{book.author || 'Đang cập nhật'}</p>
                    <div className="book-stats">
                      {renderInteractiveStars(book)}
                      <span className="views">👁 {book.viewCount || 0}</span>
                    </div>
                    {/* KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ NÚT */}
                    {(book.is_copyrighted || book.isCopyrighted) && !isUserVip ? (
                      <button 
                        className="btn-read" 
                        style={{ background: '#f39c12' }} // Đổi màu vàng cho nút VIP
                        onClick={() => navigate('/vip')}
                      >
                        👑 Đăng ký VIP để đọc
                      </button>
                    ) : (
                      <button 
                        className="btn-read" 
                        onClick={() => navigate(`/read/${book.id}`)}
                      >
                        📖 Đọc Ngay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // NẾU KHÔNG CÓ SÁCH: Hiển thị Bảng thông báo lỗi (Nằm ngoài books-grid)
          <div className="empty-state-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-state-icon" style={{ marginBottom: '20px' }}>
              {/* Ảnh icon xịn xò lấy trực tiếp từ mạng cho đẹp */}
              <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Not Found" style={{ width: '120px', opacity: 0.7 }} />
            </div>
            
            <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>Không tìm thấy Ấn phẩm nào</h3>
            
            <div className="empty-state-hints" style={{ display: 'inline-block', textAlign: 'left', color: '#555' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Gợi ý:</p>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Kiểm tra các loại và lỗi chính tả</li>
                <li>Thử những từ khóa thông thường hơn</li>
                <li>Hãy thử các từ khóa khác nhau</li>
              </ul>
            </div>
            
            <br />
            <button 
              className="btn-reset-filter" 
              onClick={() => { setSearchTerm(''); setFilterCategory(''); setFilterAuthor(''); setFilterLanguage(''); setFilterPublisher(''); }}
              style={{ marginTop: '30px', padding: '10px 25px', background: '#6b5cd1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Tải lại Tủ Sách
            </button>
          </div>
        )}
      </section>

      {/* --- KHU VỰC ẤN PHẨM ĐÃ XEM --- */}
      {recentBooks.length > 0 && (
        <section className="recent-books-section">
          <div className="content-header">
            <h2 style={{ textTransform: 'uppercase', color: '#3b398c' }}>Ấn phẩm đã xem</h2>
          </div>
          
          <div className="recent-books-row">
            {recentBooks.map((item) => {
              const book = item.book;
              if (!book) return null;
              
              const title = book.title || 'Không có tiêu đề';
              const thumbnail = book.image_link || book.imageLink || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

              return (
                <div className="recent-book-card" key={`recent-${item.id}`} onClick={() => navigate(`/read/${book.id}`)}>
                  <img src={thumbnail} alt={title} className="recent-book-cover" />
                  <div className="recent-book-info">
                    <h4 title={title}>{title}</h4>
                    <p className="recent-author">{book.author || 'Đang cập nhật'}</p>
                    <div className="recent-book-stats">
                      <span className="rating">⭐ 5.0</span>
                      <span className="views">👁 {item.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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

        {/* Khôi phục lại thanh bản quyền dưới cùng bị mất trong code cũ của ní */}
        <div className="footer-bottom">
          <span className="copyright">Sản phẩm cung cấp bởi Sinh viên HUTECH</span>
          <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⇧</button>
        </div>
      </footer>

    </div>
  );
};

export default BookPage;