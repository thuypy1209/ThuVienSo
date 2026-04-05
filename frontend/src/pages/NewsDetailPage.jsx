// src/pages/NewsDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/HomePage.css'; 
import '../css/NewsDetailPage.css'; // File CSS mới mình sẽ tạo ở bước sau

const NewsDetailPage = () => {
  const { id } = useParams(); // Lấy ID của bài viết từ trên thanh địa chỉ (URL)
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Gọi API xuống Java để lấy đúng nội dung của bài viết số "id"
    fetch(`http://localhost:8080/api/news/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data))
      .catch(err => console.log("Lỗi tải bài viết: ", err));
  }, [id]);

  if (!article) return <h2 style={{textAlign: 'center', marginTop: '100px', color: '#3b398c'}}>⏳ Đang tải nội dung bản tin...</h2>;

  // Xử lý ảnh bìa
  const imgUrl = article.imageLink || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="home-container" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* HEADER GIỮ NGUYÊN NHƯ TRANG CHỦ */}
      <header className="home-header">
        <div className="header-logo">
          <span style={{ fontSize: '26px', marginRight: '5px' }}>🎓</span> HUTECH THƯ VIỆN SỐ
        </div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
        </nav>
      </header>

      {/* NỘI DUNG BÀI VIẾT */}
      <main className="article-main-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ⬅ Quay lại
        </button>

        <article className="article-content-box">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span>📅 Đăng ngày: {new Date(article.createdAt).toLocaleDateString("vi-VN")}</span>
            <span>✍️ Nguồn: Ban Quản Trị HUTECH</span>
          </div>

          <div className="article-banner">
            <img src={imgUrl} alt="Banner" />
          </div>

          {/* Render nội dung có giữ nguyên khoảng trắng và xuống dòng */}
          <div className="article-body">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
};

export default NewsDetailPage;