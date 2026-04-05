// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/HistoryPage.css';
import '../css/HomePage.css';
import bannerImg from '../assets/library-bg.jpg';

// 🎯 Email dùng để test 
const USER_EMAIL = "viet@gmail.com";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  // --- THÊM CÁC BIẾN CHO THANH TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPublisher, setFilterPublisher] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // 1. GỌI API LẤY LỊCH SỬ ĐỌC
  const fetchReadingHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/reading/danhsach?email=${USER_EMAIL}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data || []);
      }
    } catch (err) {
      console.error("Lỗi kết nối API lịch sử:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingHistory();
  }, []);

  // 2. TẠO DANH SÁCH DROPDOWN TỰ ĐỘNG (Lấy từ những sách đã đọc)
  // Cách này giúp menu thả xuống chỉ hiện những tác giả/chủ đề có trong lịch sử của ní
  const uniqueAuthors = [...new Set(history.map(item => item.book?.author).filter(Boolean))];
  const uniqueCategories = [...new Set(history.map(item => item.book?.category).filter(Boolean))];
  const uniquePublishers = [...new Set(history.map(item => item.book?.publisher).filter(Boolean))];
  const uniqueLanguages = [...new Set(history.map(item => item.book?.language).filter(Boolean))];

  // 3. HÀM LỌC SÁCH KHI GÕ TÌM KIẾM HOẶC CHỌN DROPDOWN
  const filteredHistory = history.filter(item => {
    const book = item.book;
    if (!book) return false;

    // Chuyển chữ hoa thành chữ thường để tìm kiếm không bị lỗi
    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchAuthor = filterAuthor === '' || book.author === filterAuthor;
    const matchCategory = filterCategory === '' || book.category === filterCategory;
    const matchPublisher = filterPublisher === '' || book.publisher === filterPublisher;
    const matchLanguage = filterLanguage === '' || book.language === filterLanguage;

    return matchSearch && matchAuthor && matchCategory && matchPublisher && matchLanguage;
  });

  // 4. HÀM XÓA LỊCH SỬ
  const handleClearHistory = () => {
    if(window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc không?")) {
      setHistory([]);
      alert("Đã tạm xóa lịch sử trên trình duyệt!");
    }
  };

  return (
    <div className="history-container">
      {/* HEADER GIỮ NGUYÊN */}
      <header className="home-header">
        <div className="header-logo">🎓 HUTECH DIGILIB</div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
          <Link to="/history" className="active">Lịch sử đọc</Link>
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
      <section className="history-content">
        {loading ? (
          <h2 style={{ textAlign: 'center' }}>⏳ Đang lục lại nhật ký đọc sách...</h2>
        ) : filteredHistory.length > 0 ? (
          <>
            <div className="history-list">
              {filteredHistory.map((item) => {
                const book = item.book;
                if (!book) return null;

                const thumbnail = book.image_link || book.imageLink || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                
                return (
                  <div className="history-card" key={item.id}>
                    <img src={thumbnail} alt={book.title} className="history-cover" />
                    
                    <div className="history-details">
                      <h3>{book.title}</h3>
                      <p className="history-author">{book.author || 'Chưa rõ tác giả'}</p>
                      
                      <div className="progress-container">
                        <div className="progress-info">
                          <span>Tiến độ đọc</span>
                          <span>{item.progressPercent}%</span>
                        </div>
                        <div className="progress-track">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${item.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="history-actions">
                        <button 
                          className="btn-continue" 
                          onClick={() => navigate(`/read/${book.id}`)}
                        >
                          📖 Đọc Tiếp
                        </button>
                        <span className="history-date">
                          Lần đọc cuối: {new Date(item.lastReadTime).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="btn-clear-history" onClick={handleClearHistory}>
              🗑️ Xóa toàn bộ lịch sử
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px', marginTop: '20px' }}>
            <h2 style={{ color: '#555' }}>📭 Không tìm thấy sách!</h2>
            <p style={{ color: '#888' }}>{history.length === 0 ? "Bạn chưa đọc cuốn sách nào gần đây." : "Không có ấn phẩm nào khớp với tìm kiếm của bạn."}</p>
            <button className="btn-continue" style={{marginTop: '20px', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}} onClick={() => navigate('/books')}>
              Đi tới Tủ Sách
            </button>
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

export default HistoryPage;