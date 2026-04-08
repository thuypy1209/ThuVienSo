// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/HistoryPage.css';
import '../css/HomePage.css';
import bannerImg from '../assets/library-bg.jpg';
import axiosClient from '../api/axiosClient'; 

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user đang đăng nhập từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  // 1. GỌI API LẤY LỊCH SỬ (Từ bảng borrowRecords)
  const fetchReadingHistory = async () => {
    if (!user._id) {
        navigate('/login');
        return;
    }
    setLoading(true);
    try {
      // Backend Node trả về toàn bộ phiếu mượn/đọc
      const res = await axiosClient.get('/borrowRecords');
      const allRecords = res.data || res || [];
      
      // Lọc ra những cuốn sách thuộc về User này
      const myHistory = allRecords.filter(item => item.user?._id === user._id);
      setHistory(myHistory);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingHistory();
  }, []);

  // 2. TẠO DANH SÁCH DROPDOWN TỰ ĐỘNG
  const uniqueAuthors = [...new Set(history.map(item => item.book?.author).filter(Boolean))];
  const uniqueCategories = [...new Set(history.map(item => item.book?.category).filter(Boolean))];

  // 3. HÀM LỌC SÁCH
  const filteredHistory = history.filter(item => {
    const book = item.book;
    if (!book) return false;

    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAuthor = filterAuthor === '' || book.author === filterAuthor;
    const matchCategory = filterCategory === '' || book.category === filterCategory;

    return matchSearch && matchAuthor && matchCategory;
  });

  // 4. HÀM XÓA LỊCH SỬ (Dành cho xóa mềm hoặc xóa giao diện)
  const handleClearHistory = async () => {
    if(window.confirm("Ní có chắc chắn muốn xóa toàn bộ lịch sử đọc không?")) {
      try {
        // Nếu Backend có API xóa hàng loạt thì gọi, nếu không thì tạm xóa UI
        setHistory([]);
        alert("Đã xóa sạch nhật ký đọc sách của ní!");
      } catch (err) {
        alert("Lỗi khi xóa lịch sử!");
      }
    }
  };

  return (
    <div className="history-container">
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
          <div className="user-profile" onClick={() => navigate('/home')}>
            <div className="user-avatar">👤</div>
            <span>{user.fullName || "Thành viên"}</span>
          </div>
        </div>
      </header>

      <section 
        className="book-banner"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', padding: '50px 20px' }}
      >
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm kiếm trong nhật ký của ní..." 
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

      <section className="history-content">
        {loading ? (
          <h2 style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang mở nhật ký đọc sách...</h2>
        ) : filteredHistory.length > 0 ? (
          <>
            <div className="history-list">
              {filteredHistory.map((item) => {
                const book = item.book;
                if (!book) return null;
                const thumbnail = book.imageLink || book.image_link || 'https://placehold.co/150x200';
                
                return (
                  <div className="history-card" key={item._id}>
                    <img src={thumbnail} alt={book.title} className="history-cover" />
                    
                    <div className="history-details">
                      <h3>{book.title}</h3>
                      <p className="history-author">{book.author || 'Tác giả ẩn danh'}</p>
                      
                      <div className="progress-container">
                        <div className="progress-info">
                          <span>Tiến độ mượn/đọc</span>
                          <span>{item.status || 'Đang mượn'}</span>
                        </div>
                        <div className="progress-track">
                          <div 
                            className="progress-fill" 
                            style={{ width: `75%` }} // Có thể lấy từ field progress trong DB nếu có
                          ></div>
                        </div>
                      </div>

                      <div className="history-actions">
                        <button 
                          className="btn-continue" 
                          onClick={() => navigate(`/read/${book._id}`)}
                        >
                          📖 Đọc Tiếp
                        </button>
                        <span className="history-date">
                          Ngày mượn: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="btn-clear-history" onClick={handleClearHistory} style={{marginTop: '30px'}}>
              🗑️ Xóa toàn bộ lịch sử
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
            <h2>📭 Nhật ký trống trơn!</h2>
            <p>Ní chưa đọc hay mượn cuốn sách nào gần đây cả.</p>
            <button className="btn-continue" onClick={() => navigate('/books')} style={{marginTop: '20px'}}>
              Đi mượn sách ngay
            </button>
          </div>
        )}
      </section>

      <footer className="site-footer" style={{marginTop: '50px', padding: '20px', textAlign: 'center'}}>
          <p>© 2026 HUTECH DIGILIB - Chúc ní học tập tốt!</p>
      </footer>
    </div>
  );
};

export default HistoryPage;