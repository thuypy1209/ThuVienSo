// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import '../css/HomePage.css'; 
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const HomePage = () => {
  const navigate = useNavigate();
  const [thongKe, setThongKe] = useState({ totalBooks: 0, totalUsers: 0, totalPosts: 0 });
  const [news, setNews] = useState([]); 
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [user, setUser] = useState(null);

  // 1. Lấy dữ liệu lẻ từ localStorage
  const token = localStorage.getItem('token');
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && username) {
          setUser({
            username: username,
            role: role
          });
    }
    const fetchData = async () => {
      try {
        // 1. Gọi API lấy danh sách Sách
        const booksRes = await axiosClient.get('/books');
        const booksList = booksRes.data?.data || booksRes.data || booksRes || [];
        setSuggestedBooks(booksList.slice(0, 4));

        // 2. Gọi API lấy danh sách Tin tức (Posts)
        const newsRes = await axiosClient.get('/posts');
        const newsList = newsRes.data?.data || newsRes.data || newsRes || [];
        setNews(newsList);

        // 3. Cập nhật thống kê
        setThongKe({
          totalBooks: booksList.length || 120,
          totalUsers: 45, 
          totalPosts: newsList.length || 12
        });

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ: ", err);
        // Dữ liệu giả phòng hờ khi API lỗi
        if (news.length === 0) {
            setNews([
                { _id: '1', title: 'HUTECH Khai trương Thư Viện Số 2026', imageLink: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800', createdAt: new Date() },
                { _id: '2', title: 'Top 10 cuốn sách lập trình đáng đọc nhất', imageLink: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200', createdAt: new Date() }
            ]);
        }
      }
    };

    fetchData();
  }, [token, username, role]); 

  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch sành sanh mọi thứ
    navigate('/login'); 
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
          
          {username ? (
            <div className="user-menu-container">
              {/* Khi bấm vào avatar hoặc tên thì đảo ngược trạng thái showDropdown */}
              <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
                <span className="username-text">{username}</span>
                <div className="user-avatar">👤</div>
              </div>

              {/* Menu thả xuống - Chỉ hiện khi showDropdown là true */}
              {showDropdown && (
                <ul className="user-dropdown-menu">
                  <li onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}>👤 Hồ sơ của tôi</li>
                  <li onClick={(e) => { e.stopPropagation(); navigate('/favorites'); }}>❤️ Sách yêu thích</li>
                  {role === 'admin' && <li onClick={(e) => { e.stopPropagation(); navigate('/admin'); }}>⚙️ Trang quản trị</li>}
                  <hr />
                  <li className="logout-item" onClick={handleLogout}>🚪 Đăng xuất</li>
                </ul>
              )}
            </div>
          ) : (
            <button className="btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
          )}
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

      {/* 4. GỢI Ý ĐỌC */}
      <section className="suggested-books-section" style={{marginTop: '40px'}}>
        <div className="section-header">
          <h2 className="section-title">Gợi ý đọc <span>dựa trên sở thích của bạn</span></h2>
          <Link to="/books" className="view-all">Xem tất cả ➔</Link>
        </div>
        <div className="book-carousel">
          {suggestedBooks.length > 0 ? suggestedBooks.map((book) => (
            <div 
              className="book-card" 
              key={book._id || book.id}
              onClick={() => navigate(`/read/${book._id || book.id}`)}
              title={`Bấm để đọc cuốn: ${book.title}`}
            >
              <div className="book-cover-container">
                <img src={book.imageLink || 'https://placehold.co/150x200?text=No+Cover'} alt={book.title} className="book-cover" />
                <div className="book-cover-overlay"><span>📖 Đọc ngay</span></div>
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author?.name || book.author || 'Đang cập nhật'}</p>
              </div>
            </div>
          )) : <p>Đang tải sách...</p>}
        </div>
      </section>

      {/* 5. TIN TỨC */}
      <section className="news-section">
        <h2 className="section-title">Tin Tức <span>Nóng Nổi Bật</span></h2>
        {news.length > 0 ? (
          <div className="news-grid">
            <div className="news-main" onClick={() => navigate(`/news/${news[0]._id}`)}>
              <img src={news[0].imageLink || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800'} alt="Main News" />
              <div className="news-main-title">{news[0].title}</div>
            </div>
            <div className="news-list">
              {news.slice(1, 4).map((article) => (
                <div className="news-item" key={article._id} onClick={() => navigate(`/news/${article._id}`)}>
                  <img src={article.imageLink || 'https://placehold.co/100x60'} alt="News" />
                  <div className="news-item-info">
                    <h5>{article.title}</h5>
                    <p>🕒 {new Date(article.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p>Chưa có bản tin mới.</p>}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col" style={{flex: 1.5}}>
            <h3>🎓 HUTECH THƯ VIỆN SỐ</h3>
            <p>Địa chỉ: Khu Công nghệ cao, TP. Thủ Đức, TP.HCM</p>
          </div>
          <div className="footer-col" style={{flex: 2}}>
            <p>📞 0966827161</p>
            <p>✉️ minhandeptrainhat@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;