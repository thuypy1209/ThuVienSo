// src/pages/PostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../css/PostDetailPage.css';
import '../css/HomePage.css';

const PostDetailPage = () => {
  const { id } = useParams(); // Lấy ID bài viết từ trên thanh URL xuống
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  // Dữ liệu bình luận ảo (Chờ Backend có bảng Comments thì gọi API thay vào)
  const [comments, setComments] = useState([
    { id: 101, text: "Bạn thử thêm @CrossOrigin(\"*\") vào Controller xem sao nhé. Lỗi CORS thường do bảo mật của trình duyệt chặn đó.", author: "Nguyễn Minh T.", votes: 15, isBest: true, date: "18/03/2026" },
    { id: 102, text: "Nếu dùng React thì xem lại đường dẫn lúc fetch() đã đúng port 8080 chưa nha bro.", author: "Trần Nhựt Việt", votes: 3, isBest: false, date: "18/03/2026" }
  ]);
  const [newComment, setNewComment] = useState('');

  // Tạm thời fetch toàn bộ bài viết rồi lọc ra bài có ID trùng khớp
  useEffect(() => {
    fetch('http://localhost:8080/api/posts/danhsach')
      .then(res => res.json())
      .then(data => {
        const foundPost = data.find(p => p.id.toString() === id);
        setPost(foundPost);
      })
      .catch(err => console.log("Lỗi tải bài viết: ", err));
  }, [id]);

  // Hàm xử lý khi gửi bình luận
  const handleReply = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Math.random(),
      text: newComment,
      author: "Ní Việt (Bạn)",
      votes: 0,
      isBest: false,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setComments([...comments, commentObj]); // Thêm comment vào danh sách
    setNewComment(''); // Xóa trắng ô nhập
  };

  if (!post) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>⏳ Đang tải bài viết...</h2>;

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
          <div className="user-profile" onClick={() => navigate('/')}>
            <div className="user-avatar">👤</div><span>Ní Việt</span>
          </div>
        </div>
      </header>

      <div className="post-detail-content">
        {/* Nút quay lại */}
        <Link to="/forum" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#004085', fontWeight: 'bold' }}>
          ⬅ Quay lại Diễn đàn
        </Link>

        {/* BÀI VIẾT CHÍNH */}
        <div className="main-post-box">
          <h1>{post.title}</h1>
          <div className="post-meta-info">
            Đăng bởi <strong>{post.authorName || 'Sinh viên HUTECH'}</strong> | 🕒 {new Date(post.createdAt).toLocaleDateString('vi-VN')}
          </div>
          <div className="post-body-text">{post.content}</div>
        </div>

        {/* KHU VỰC BÌNH LUẬN */}
        <div className="answers-section">
          <h3>{comments.length} Câu trả lời</h3>

          {comments.map(cmt => (
            <div className={`answer-card ${cmt.isBest ? 'best-answer' : ''}`} key={cmt.id}>
              {/* CỘT VOTE */}
              <div className="vote-col">
                <button className="vote-btn up" title="Upvote">▲</button>
                <div className="vote-score">{cmt.votes}</div>
                <button className="vote-btn down" title="Downvote">▼</button>
                {cmt.isBest && <div className="best-badge" title="Câu trả lời hay nhất">⭐</div>}
              </div>
              
              {/* NỘI DUNG COMMENT */}
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
            placeholder="Viết câu trả lời hoặc gợi ý của bạn ở đây..."
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