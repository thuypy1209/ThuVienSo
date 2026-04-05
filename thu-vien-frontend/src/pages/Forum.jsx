import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import '../css/Home.css'; // Xài lại CSS của trang chủ

const socket = io('http://localhost:3000');

const Forum = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    
    // Quản lý trạng thái mở rộng bình luận của từng bài viết
    const [expandedComments, setExpandedComments] = useState({}); 
    const [commentInputs, setCommentInputs] = useState({});
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/messages'); 
                setPosts(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy bài đăng:", err);
            }
        };
        fetchPosts();

        // Lắng nghe bài đăng mới từ Socket.io
        socket.on('receive_post', (data) => {
            setPosts((prev) => [data, ...prev]);
        });
        
        return () => socket.off('receive_post');
    }, []);

    // --- HÀM ĐĂNG BÀI ---
    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        // Bắn dữ liệu qua Socket
        socket.emit('send_post', {
            sender: userInfo._id,
            content: newPost,
            // Thêm các trường rỗng để tránh lỗi khi render ngay lập tức
            likes: [], 
            comments: []
        });
        setNewPost('');
    };

    // --- HÀM LIKE BÀI VIẾT ---
    const handleLike = async (postId) => {
        try {
            // Giả sử Backend của ní có API này
            // await api.post(`/messages/${postId}/like`);
            
            // Tạm thời update giao diện (Demo)
            setPosts(posts.map(p => {
                if(p._id === postId) {
                    const isLiked = p.likes?.includes(userInfo._id);
                    return { 
                        ...p, 
                        likes: isLiked ? p.likes.filter(id => id !== userInfo._id) : [...(p.likes || []), userInfo._id] 
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error(error);
        }
    };

    // --- HÀM ẨN/HIỆN BÌNH LUẬN ---
    const toggleComments = (postId) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // --- HÀM GỬI BÌNH LUẬN ---
    const handleCommentSubmit = async (postId) => {
        const cmtText = commentInputs[postId];
        if(!cmtText?.trim()) return;

        try {
            // await api.post(`/messages/${postId}/comment`, { text: cmtText });
            alert("Đã gửi bình luận!");
            setCommentInputs({...commentInputs, [postId]: ''});
        } catch (error) {
            console.error(error);
        }
    };

    // --- HÀM BÁO CÁO ---
    const handleReport = (postId) => {
        if(window.confirm("Bạn có chắc chắn muốn báo cáo bài viết này vi phạm tiêu chuẩn cộng đồng?")) {
            alert("Cảm ơn bạn đã báo cáo. Quản trị viên sẽ xem xét!");
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {/* --- NAVBAR --- */}
            <nav className="navbar" style={navStyle}>
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                
                <div className="nav-links" style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#4a4a4a' }}>
                    <span style={linkStyle} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={{...linkStyle, color: '#1a5f7a', fontWeight: 'bold'}} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={linkStyle} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={linkStyle} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={linkStyle} onClick={() => navigate('/borrow-history')}>📋 Mượn sách</span>
                    <span style={linkStyle} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span style={linkStyle} onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span style={linkStyle} onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>

                <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '500', color: '#333' }}>Xin chào, <span style={{ color: '#1a5f7a', fontWeight: 'bold' }}>{userInfo.fullName || 'Bạn'}</span></span>
                    <button onClick={() => {localStorage.clear(); navigate('/')}} style={logoutBtnStyle}>Đăng xuất</button>
                </div>
            </nav>

            {/* --- NỘI DUNG DIỄN ĐÀN --- */}
            <div style={{ maxWidth: '680px', margin: '30px auto', padding: '0 15px' }}>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                    <h2 style={{ margin: 0, color: '#1a5f7a', fontSize: '26px' }}>💬 Diễn Đàn Trao Đổi</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>Nơi sinh viên HUTECH thảo luận, chia sẻ tài liệu và giải đáp thắc mắc.</p>
                </div>
                
                {/* Khu vực tạo bài đăng */}
                <div style={createPostCardStyle}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={avatarLgStyle}>{userInfo.fullName?.charAt(0) || 'U'}</div>
                        <textarea 
                            value={newPost} 
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder={`Việt ơi, bạn đang muốn thảo luận về chủ đề gì?`}
                            style={textareaStyle}
                        />
                    </div>
                    <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handlePost} style={btnStyle} disabled={!newPost.trim()}>🚀 Đăng chủ đề mới</button>
                    </div>
                </div>

                {/* Danh sách bài đăng */}
                {posts.length > 0 ? posts.map(post => (
                    <div key={post._id} style={postCardStyle}>
                        {/* Header Bài viết */}
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={avatarMdStyle}>{post.sender?.fullName?.charAt(0) || 'A'}</div>
                                <div style={{marginLeft: '12px'}}>
                                    <b style={{ color: '#1c1e21', fontSize: '16px' }}>{post.sender?.fullName || 'Người dùng ẩn danh'}</b>
                                    <p style={{ color: '#65676b', fontSize: '13px', margin: '2px 0 0 0' }}>
                                        {post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleReport(post._id)} style={reportBtnStyle} title="Báo cáo vi phạm">🚩</button>
                        </div>
                        
                        {/* Nội dung bài viết */}
                        <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#1c1e21', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </p>
                        
                        {/* Số đếm Like & Comment */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#65676b', fontSize: '14px', borderBottom: '1px solid #ebedf0', paddingBottom: '10px', marginBottom: '10px' }}>
                            <span>👍 {post.likes?.length || 0} lượt thích</span>
                            <span style={{cursor: 'pointer'}} onClick={() => toggleComments(post._id)}>
                                💬 {post.comments?.length || 0} bình luận
                            </span>
                        </div>

                        {/* Thanh công cụ Tương tác */}
                        <div style={{display: 'flex', justifyContent: 'space-around', gap: '10px', padding: '5px 0'}}>
                            <button 
                                onClick={() => handleLike(post._id)} 
                                style={{...actionBtnStyle, color: post.likes?.includes(userInfo._id) ? '#1877f2' : '#65676b'}}
                            >
                                {post.likes?.includes(userInfo._id) ? '👍 Đã thích' : '👍 Thích'}
                            </button>
                            <button onClick={() => toggleComments(post._id)} style={actionBtnStyle}>
                                💬 Bình luận
                            </button>
                        </div>

                        {/* --- KHU VỰC BÌNH LUẬN (Chỉ hiện khi bấm nút) --- */}
                        {expandedComments[post._id] && (
                            <div style={commentSectionStyle}>
                                {/* Lưới danh sách bình luận (Nơi hiển thị các cmt thật) */}
                                {post.comments && post.comments.map((cmt, idx) => (
                                    <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '12px'}}>
                                        <div style={{...avatarMdStyle, width: '32px', height: '32px', fontSize: '14px'}}>{cmt.user?.charAt(0) || 'U'}</div>
                                        <div style={{ backgroundColor: '#f0f2f5', padding: '10px 15px', borderRadius: '15px', maxWidth: '80%' }}>
                                            <b style={{fontSize: '13px', display: 'block', marginBottom: '3px'}}>{cmt.user || 'Thành viên'}</b>
                                            <span style={{fontSize: '14px'}}>{cmt.text}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Ô nhập bình luận mới */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <div style={{...avatarMdStyle, width: '36px', height: '36px'}}>{userInfo.fullName?.charAt(0)}</div>
                                    <div style={{ display: 'flex', flex: 1, backgroundColor: '#f0f2f5', borderRadius: '20px', padding: '5px 15px', alignItems: 'center' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Viết bình luận của bạn..." 
                                            value={commentInputs[post._id] || ''}
                                            onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '14px' }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(post._id); }}
                                        />
                                        <button onClick={() => handleCommentSubmit(post._id)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#1877f2', fontWeight: 'bold'}}>Gửi</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div style={{textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '10px', color: '#666'}}>
                        Chưa có chủ đề nào được thảo luận. Hãy là người đầu tiên bóc tem! 🚀
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// CÁC OBJECT CSS NỘI TUYẾN 
// ==========================================
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const linkStyle = { cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };

const createPostCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #e1e4e8' };
const textareaStyle = { width: '100%', border: 'none', outline: 'none', resize: 'none', height: '50px', fontSize: '16px', backgroundColor: '#f0f2f5', borderRadius: '25px', padding: '15px 20px', boxSizing: 'border-box' };
const btnStyle = { backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

const postCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e1e4e8' };
const actionBtnStyle = { flex: 1, backgroundColor: 'transparent', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' };
const reportBtnStyle = { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', opacity: 0.5, transition: '0.2s' };

const commentSectionStyle = { borderTop: '1px solid #ebedf0', marginTop: '10px', paddingTop: '15px' };

const avatarLgStyle = { width: '45px', height: '45px', minWidth: '45px', backgroundColor: '#1a5f7a', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' };
const avatarMdStyle = { width: '40px', height: '40px', minWidth: '40px', backgroundColor: '#3498db', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' };

export default Forum;