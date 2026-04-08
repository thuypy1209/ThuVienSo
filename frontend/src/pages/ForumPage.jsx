// src/pages/ForumPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ForumPage.css'; 
import '../css/HomePage.css'; 
import axiosClient from '../api/axiosClient'; // ✅ Dùng hàng hiệu axiosClient

const ForumPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user đang đăng nhập
  const user = (() => {
    const savedUser = localStorage.getItem("user");
    // Nếu không có dữ liệu, hoặc dữ liệu bị biến thành chuỗi "undefined"
    if (!savedUser || savedUser === "undefined") return {}; 
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      console.error("Lỗi parse user:", e);
      return {}; // Trả về object rỗng nếu parse lỗi
    }
})();

  // --- CÁC BIẾN CHO POPUP ĐĂNG BÀI ---
  const [showModal, setShowModal] = useState(false); 
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Hàm load danh sách bài viết từ Backend Node
  const fetchPosts = async () => {
    try {
      // Backend Node đặt là /posts
      const res = await axiosClient.get('/posts');
      // AxiosClient đã có interceptor nên lấy res trực tiếp
      setPosts(res.data || res || []);
      setLoading(false);
    } catch (err) {
      console.log("Lỗi tải bài viết: ", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- HÀM XỬ LÝ KHI BẤM NÚT "ĐĂNG BÀI" ---
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!user._id) {
        alert("Ní phải đăng nhập mới được đặt câu hỏi nhé!");
        navigate('/login');
        return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    try {
      // Gọi API gửi bài viết lên Node.js
      // Cấu trúc data gửi lên phải khớp với Schema posts.js của Backend
      await axiosClient.post('/posts', { 
        title: newTitle, 
        content: newContent,
        author: user._id // ✅ Truyền _id của user đang đăng nhập
      });

      alert("🎉 Đăng bài thành công rực rỡ!");
      setShowModal(false); 
      setNewTitle('');    
      setNewContent('');
      fetchPosts(); // Load lại danh sách mới
    } catch (error) {
      console.log("Lỗi: ", error);
      alert(error.message || "Không thể đăng bài lúc này!");
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
          <div className="user-profile" onClick={() => navigate('/home')}>
            <div className="user-avatar">👤</div>
            <span> {user.fullName || 'Khách'}</span>
          </div>
        </div>
      </header>

      {/* BANNER DIỄN ĐÀN */}
      <section className="forum-banner">
        <h1>💬 Cộng Đồng Hỏi Đáp & Thảo Luận</h1>
        <p>Nơi giao lưu, chia sẻ kiến thức của cộng đồng sinh viên HUTECH</p>
      </section>

      {/* BỐ CỤC 2 CỘT */}
      <section className="forum-content">
        
        {/* CỘT TRÁI: DANH SÁCH CÂU HỎI */}
        <div className="forum-main">
          <div className="forum-filters">
            <button className="active">Mới nhất</button>
            <button>Phổ biến</button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white' }}>⏳ Đang tải dữ liệu diễn đàn...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div className="post-card" key={post._id}>
                <div className="post-stats-left">
                  <div className="stat-box">
                    <div className="stat-num">{Math.floor(Math.random() * 10)}</div>
                    <div className="stat-label">votes</div>
                  </div>
                </div>

                <div className="post-info">
                  <Link to={`/news/${post._id}`} style={{textDecoration: 'none'}}>
                    <h3 className="post-title">{post.title}</h3>
                  </Link>
                  <p className="post-excerpt">
                    {post.content ? (post.content.substring(0, 150) + "...") : "Bấm để xem chi tiết bài viết..."}
                  </p>
                  <div className="post-meta">
                    <div className="post-tags">
                      <span className="tag">hutech-tech</span>
                    </div>
                    <div className="post-author">
                      Đăng bởi <strong>{post.author?.fullName || 'Sinh viên HUTECH'}</strong> • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white' }}>Chưa có câu hỏi nào. Đặt câu hỏi ngay ní ơi!</div>
          )}
        </div>

        {/* CỘT PHẢI: SIDEBAR */}
        <div className="forum-sidebar">
          <button className="btn-create-post" onClick={() => setShowModal(true)}>
            ✍️ ĐẶT CÂU HỎI MỚI
          </button>

          <div className="sidebar-widget">
            <h3>🏆 Top Đóng Góp</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
              <li>🥇 {user.fullName || 'Ní Việt'} - <span style={{color: '#888'}}>Vip Pro</span></li>
              <li>🥈 Nguyễn Văn A - <span style={{color: '#888'}}>Thành viên tích cực</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* POPUP ĐĂNG BÀI */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tạo bài viết mới</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Tiêu đề bài viết (*)</label>
                <input 
                  type="text" 
                  placeholder="Tiêu đề ngắn gọn, xúc tích..." 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Nội dung chi tiết (*)</label>
                <textarea 
                  rows="6" 
                  placeholder="Chia sẻ nội dung hoặc đặt câu hỏi tại đây..."
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