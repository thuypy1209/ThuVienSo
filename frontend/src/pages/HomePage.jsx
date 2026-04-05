// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import '../css/HomePage.css'; 
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [thongKe, setThongKe] = useState({ totalBooks: 0, totalUsers: 0, totalPosts: 0 });
  const [news, setNews] = useState([]); // 👉 Đổi tên từ baiViet thành news cho đúng chuẩn
  const [suggestedBooks, setSuggestedBooks] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem("user");

  // ✅ kiểm tra trước khi parse
  if (token && userStr && userStr !== "undefined") {
    try {
      const savedUser = JSON.parse(userStr);
      setUser(savedUser);
    } catch (err) {
      console.error("JSON parse lỗi:", err);
      localStorage.removeItem("user"); // xóa dữ liệu lỗi
    }
  }

  const fetchData = async () => {
    try {
      const booksData = await axiosClient.get('/books');
      setSuggestedBooks(booksData.slice(0, 4));

      setThongKe({
        totalBooks: booksData.length || 120,
        totalUsers: 45,
        totalPosts: 12
      });

      setNews([
        { id: 1, title: 'HUTECH Khai trương Thư Viện Số 2026', imageLink: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800', createdAt: new Date() },
        { id: 2, title: 'Top 10 cuốn sách lập trình đáng đọc nhất', imageLink: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200', createdAt: new Date() },
        { id: 3, title: 'Hướng dẫn sử dụng hệ thống thư viện mới', imageLink: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=200', createdAt: new Date() }
      ]);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu trang chủ: ", err);
    }
  };

  fetchData();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Đăng xuất xong đẩy về trang Login
  };

  return (
    <div className="home-container">
      {/* 1. HEADER */}
      <header className="home-header">
        <div className="header-logo">
          <span style={{ fontSize: '26px', marginRight: '5px' }}>🎓</span> 
          THƯ VIỆN SỐ
        </div>
        <nav className="header-nav">
          <Link to="/home" className="active">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
          <Link to="/history">Lịch sử đọc</Link>
        </nav>
        <div className="header-actions">
          <span>🔔</span> <span>❤️</span>
          <div className="user-profile" onClick={handleLogout} title="Bấm để đăng xuất">
            <div className="user-avatar">👤</div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-title">
          <h2>Chào mừng bạn đến với</h2>
          <h1>HỆ THỐNG THƯ VIỆN KỸ THUẬT SỐ HUTECH</h1>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Nhập tên sách, tác giả, hoặc thể loại..." />
          <button onClick={() => navigate('/books')}>Tìm kiếm nâng cao</button>
        </div>
      </section>

      {/* 3. BẢNG THỐNG KÊ */}
      <section className="highlights-section">
        <div className="banner-img">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop" alt="Thư viện" />
        </div>
        
        <div className="stats-box">
          <h3>Những số liệu nổi bật</h3>
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h4>{thongKe.totalBooks}</h4> 
              <p>Cuốn sách kỹ thuật số</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h4>{thongKe.totalUsers}</h4>
              <p>Thành viên tham gia</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h4>{thongKe.totalPosts}</h4>
              <p>Bài viết diễn đàn</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. GỢI Ý ĐỌC */}
      {/* ========================================== */}
      <section className="suggested-books-section" style={{marginTop: '40px'}}>
        <div className="section-header">
          <h2 className="section-title">Gợi ý đọc <span>dựa trên sở thích của bạn</span></h2>
          <Link to="/books" className="view-all">Xem tất cả ➔</Link>
        </div>
        
        <div className="book-carousel">
          {suggestedBooks.length > 0 ? suggestedBooks.map((book) => {
            const imgUrl = book.image_link || book.imageLink || 'https://placehold.co/150x200?text=No+Cover';
            
            return (
              <div 
                className="book-card" 
                key={book.id} 
                onClick={() => navigate(`/read/${book.id}`)}
                title={`Bấm để đọc cuốn: ${book.title}`}
              >
                <div className="book-cover-container">
                  <img src={imgUrl} alt={book.title} className="book-cover" />
                  <div className="book-cover-overlay">
                    <span>📖 Đọc ngay</span>
                  </div>
                </div>
                
                <div className="book-info">
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <p className="book-author">{book.author || 'Đang cập nhật'}</p>
                </div>
              </div>
            );
          }) : (
            <p style={{color: '#888', fontStyle: 'italic', paddingLeft: '15px'}}>Chưa có sách nào được đánh dấu Gợi ý ở Admin...</p>
          )}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. TIN TỨC & THÔNG BÁO NỔI BẬT */}
      {/* ========================================================== */}
      <section className="news-section">
        <h2 className="section-title">Tin Tức <span>Nóng Nổi Bật</span></h2>

        {news && news.length > 0 ? (
          <div className="news-grid">
            
            {/* A. BÀI VIẾT NỔI BẬT TO NHẤT BÊN TRÁI */}
            <div 
              className="news-main" 
              onClick={() => navigate(`/news/${news[0].id}`)} 
              style={{ cursor: 'pointer' }}
              title={`Bấm để đọc tin: ${news[0].title}`}
            >
              <img 
                src={news[0].imageLink || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800'} 
                alt="Main News Banner" 
              />
              <div className="news-main-title">{news[0].title}</div>
            </div>

            {/* B. DANH SÁCH 3 BÀI TIẾP THEO BÊN PHẢI */}
            <div className="news-list">
              {news.map((article, index) => {
                if (index === 0) return null;
                if (index > 3) return null;

                const itemImg = article.imageLink || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200';
                
                return (
                  <div 
                    className="news-item" 
                    key={article.id} 
                    onClick={() => navigate(`/news/${article.id}`)} 
                    style={{cursor: 'pointer'}}
                    title={`Bấm để đọc tin: ${article.title}`}
                  >
                    <img src={itemImg} alt="News Thumbnail" />
                    <div className="news-item-info">
                      <h5>{article.title}</h5>
                      <p>🕒 {new Date(article.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px', gridColumn: '1 / -1' }}>
            Chưa có bản tin nổi bật nào được cập nhật...
          </p>
        )}
      </section>

      {/* 6. FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col" style={{flex: 1.5}}>
            <h3><span style={{ fontSize: '20px' }}>🎓</span> HUTECH THƯ VIỆN SỐ</h3>
            <p>Trường Đại học Công nghệ TP.HCM</p>
            <p> Sở Giáo dục và đào tạo tp.hcm</p>
            <p>Địa chỉ: Khu Công nghệ cao, TP. Thủ Đức, TP.HCM</p>
            <p>Điện thoại: 0966827161</p>
          </div>
          <div className="footer-col" style={{flex: 2}}>
            <p>📍 Khu Công nghệ cao, TP. Thủ Đức, TP.HCM</p>
            <p> Bình thạnh Đường D5 Tp.hcm</p>
            <p>📞 0966827161</p>
            <p>✉️ minhandeptrainhat@gmail.com</p>
          </div>
          <div className="footer-col" style={{flex: 1}}>
            <a href="#">ℹ️ Giới thiệu</a>
            <a href="#">❓ Hướng dẫn sử dụng</a>
            <a href="#">📜 Chính sách bảo mật</a>
            <a href="#">📞 Liên hệ hỗ trợ</a>
          </div>
        </div>
      </footer>

      <div className="floating-chat-btn" title="Chat hỗ trợ 24/7">💬</div>
    </div>
  );
};

export default HomePage;