// src/pages/PostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../css/PostDetailPage.css';
import '../css/HomePage.css';
import axiosClient from '../api/axiosClient'; // ✅ Dùng hàng hiệu axiosClient

const PostDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Dữ liệu bình luận (Ní giữ lại để demo, sau này có bảng Comments thì gọi API tương tự Posts)
  const [comments, setComments] = useState([
    { id: 101, text: "Bạn thử dùng axiosClient thay cho fetch xem, nó tự đính kèm Token đó.", author: "Nguyễn Minh T.", votes: 15, isBest: true, date: "18/03/2026" },
    { id: 102, text: "Hệ thống Node.js này chạy mượt quá ní ơi!", author: "Trần Nhựt Việt", votes: 3, isBest: false, date: "18/03/2026" }
  ]);
  const [newComment, setNewComment] = useState('');

  // --- 1. GỌI API LẤY CHI TIẾT BÀI VIẾT (Dùng ID từ URL) ---
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        // Gọi thẳng API: /posts/:id
        const res = await axiosClient.get(`/posts/${id}`);
        setPost(res.data || res);
      } catch (err) {
        console.error("Lỗi tải chi tiết bài viết: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

  // --- 2. HÀM XỬ LÝ GỬI BÌNH LUẬN ---
  const handleReply = () => {
    if (!newComment.trim()) return;
    if (!user._id) return alert("Ní đăng nhập mới bình luận được nha!");

    const commentObj = {
      id: Math.random(),
      text: newComment,
      author: user.fullName || "Thành viên",
      votes: 0,
      isBest: false,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setComments([...comments, commentObj]); 
    setNewComment(''); 
  };

  if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>⏳ Đang mở bài viết...</h2>;
  if (!post) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>❌ Không tìm thấy bài viết này!</h2>;

  return (
    <div className="post-detail-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-logo"><span style={{ fontSize: '26px', marginRight: '5px' }}>🎓</span> HUTECH DIGILIB</div>
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
            <div className="user-avatar">👤</div><span>{user.fullName || "Thành viên"}</span>
          </div>
        </div>
      </header>

      <div className="post-detail-content">
        <Link to="/forum" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#004085', fontWeight: 'bold' }}>
          ⬅ Quay lại Diễn đàn
        </Link>

        {/* BÀI VIẾT CHÍNH */}
        <div className="main-post-box">
          <h1>{post.title}</h1>
          <div className="post-meta-info">
            {/* Backend dùng populate('author') nên ta lấy được fullName trực tiếp */}
            Đăng bởi <strong>{post.author?.fullName || 'Sinh viên HUTECH'}</strong> | 🕒 {new Date(post.createdAt).toLocaleDateString('vi-VN')}
          </div>
          <div className="post-body-text" style={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>

        {/* KHU VỰC BÌNH LUẬN */}
        <div className="answers-section">
          <h3>{comments.length} Câu trả lời</h3>

          {comments.map(cmt => (
            <div className={`answer-card ${cmt.isBest ? 'best-answer' : ''}`} key={cmt.id}>
              <div className="vote-col">
                <button className="vote-btn up">▲</button>
                <div className="vote-score">{cmt.votes}</div>
                <button className="vote-btn down">▼</button>
                {cmt.isBest && <div className="best-badge">⭐</div>}
              </div>
              
              <div className="answer-content">
                <div className="answer-text">{cmt.text}</div>
                <div className="answer-author">- {cmt.author} ({cmt.date})</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ô NHẬP CÂU TRẢ LỜI */}
        <div className="reply-box">
          <h3>Câu trả lời của bạn</h3>
          <textarea 
            rows="5" 
            placeholder="Chia sẻ giải pháp của bạn cho ní này..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="btn-post-reply" onClick={handleReply}>Đăng câu trả lời</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;