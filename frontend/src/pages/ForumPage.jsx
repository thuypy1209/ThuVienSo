// src/pages/ForumPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ForumPage.css'; 
import '../css/HomePage.css'; 

const ForumPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CÁC BIẾN CHO POPUP ĐĂNG BÀI ---
  const [showModal, setShowModal] = useState(false); // Bật tắt Popup
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Hàm load danh sách bài viết
  const fetchPosts = () => {
    fetch('http://localhost:8080/api/posts/danhsach')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Lỗi tải bài viết: ", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- HÀM XỬ LÝ KHI BẤM NÚT "ĐĂNG BÀI" TRONG POPUP ---
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    try {
      // Gọi API gửi bài viết xuống Spring Boot
      const response = await fetch('http://localhost:8080/api/posts/tao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          content: newContent,
          // Đổi chữ authorName thành biến user, và truyền id của user vào
          user: { id: 1 } 
        })
      });

      if (response.ok) {
        alert("Đăng bài thành công!");
        setShowModal(false); // Tắt popup
        setNewTitle('');     // Xóa trắng form
        setNewContent('');
        fetchPosts();        // Tải lại danh sách bài viết mới nhất
      } else {
        alert("Có lỗi xảy ra khi lưu bài viết vào Database!");
      }
    } catch (error) {
      console.log("Lỗi: ", error);
      alert("Không kết nối được với máy chủ Backend!");
    }
  };

  return (
    <div className="forum-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-logo">
          <span style={{ fontSize: '26px', marginRight: '5px' }}>🎓</span> HUTECH DIGILIB
        </div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books">Tủ sách</Link>
          <Link to="/forum" className="active">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
          <Link to="/history">Lịch sử đọc</Link>
        </nav>
        <div className="header-actions">
          <span>🔔</span> <span>❤️</span>
          <div className="user-profile" onClick={() => navigate('/')}>
            <div className="user-avatar">👤</div>
            <span> Việt (Đăng xuất)</span>
          </div>
        </div>
      </header>

      {/* BANNER DIỄN ĐÀN */}
      <section className="forum-banner">
        <h1>💬 Cộng Đồng Hỏi Đáp & Thảo Luận</h1>
        <p>Nơi giao lưu, chia sẻ kiến thức và giải đáp thắc mắc của sinh viên HUTECH</p>
      </section>

      {/* BỐ CỤC 2 CỘT */}
      <section className="forum-content">
        
        {/* CỘT TRÁI: DANH SÁCH CÂU HỎI */}
        <div className="forum-main">
          <div className="forum-filters">
            <button className="active">Mới nhất</button>
            <button>Top Vote</button>
            <button>Chưa có câu trả lời</button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white' }}>⏳ Đang tải dữ liệu diễn đàn...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div className="post-card" key={post.id}>
                <div className="post-stats-left">
                  <div className="stat-box">
                    <div className="stat-num">{Math.floor(Math.random() * 50)}</div>
                    <div className="stat-label">votes</div>
                  </div>
                  <div className={`stat-box answers ${Math.random() > 0.5 ? 'accepted' : ''}`}>
                    <div className="stat-num">{Math.floor(Math.random() * 15)}</div>
                    <div className="stat-label">answers</div>
                  </div>
                </div>

                <div className="post-info">
                  <Link to={`/forum/${post.id}`} style={{textDecoration: 'none'}}>
                  <h3 className="post-title">{post.title}</h3>
                  </Link>
                  <p className="post-excerpt">{post.content || "Nội dung bài viết đang được cập nhật..."}</p>
                  <div className="post-meta">
                    <div className="post-tags">
                      <span className="tag">câu-hỏi-mới</span>
                    </div>
                    <div className="post-author">
                      Đăng bởi <strong>{post.authorName || 'Sinh viên HUTECH'}</strong> vào lúc {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white' }}>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</div>
          )}
        </div>

        {/* CỘT PHẢI: SIDEBAR */}
        <div className="forum-sidebar">
          {/* NÚT BẬT POPUP (Thay đổi ở đây) */}
          <button className="btn-create-post" onClick={() => setShowModal(true)}>
            ✍️ ĐẶT CÂU HỎI MỚI
          </button>

          <div className="sidebar-widget">
            <h3>🏆 Top Đóng Góp Tháng</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
              <li>🥇 Trần Nhựt Việt - <span style={{color: '#888'}}>1200 pts</span></li>
              <li>🥈 Nguyễn Văn A - <span style={{color: '#888'}}>980 pts</span></li>
              <li>🥉 Lê Thị B - <span style={{color: '#888'}}>750 pts</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================
          CỬA SỔ NỔI (POPUP) ĐĂNG BÀI - CHỈ HIỆN KHI showModal = true
          ========================================================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tạo bài viết mới</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Tiêu đề câu hỏi (*)</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Làm sao để sửa lỗi CORS trong Spring Boot?" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Nội dung chi tiết (*)</label>
                <textarea 
                  rows="6" 
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn-submit">Đăng bài ngay</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ForumPage;