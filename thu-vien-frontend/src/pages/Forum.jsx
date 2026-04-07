import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import '../css/Home.css'; 

const socket = io('http://localhost:3000');

const EMOJIS = ['😀', '😂', '😍', '😎', '🙏', '👍', '🔥', '❤️', '🎉', '💡'];

const Forum = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [imageFile, setImageFile] = useState(null); 
    
    const [expandedComments, setExpandedComments] = useState({}); 
    const [commentInputs, setCommentInputs] = useState({});
    const [commentImages, setCommentImages] = useState({}); 
    const [showEmojis, setShowEmojis] = useState({}); 
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts'); 
                setPosts(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy bài đăng:", err);
            }
        };
        fetchPosts();

        socket.on('receive_post', (newPostData) => {
            setPosts((prev) => [newPostData, ...prev]);
        });

        socket.on('receive_like', ({ postId, likes }) => {
            setPosts((prev) => prev.map(p => p._id === postId ? { ...p, likes } : p));
        });

        socket.on('receive_comment', ({ postId, newComment }) => {
            setPosts((prev) => prev.map(p => {
                if (p._id === postId) {
                    const exists = p.comments?.find(c => c._id === newComment._id);
                    return exists ? p : { ...p, comments: [...(p.comments || []), newComment] };
                }
                return p;
            }));
        });
        
        return () => {
            socket.off('receive_post');
            socket.off('receive_like');
            socket.off('receive_comment');
        };
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !imageFile) return;

        try {
            const formData = new FormData();
            formData.append('sender', userId);
            if (newPost.trim()) formData.append('content', newPost);
            if (imageFile) formData.append('image', imageFile);

            const res = await api.post('/posts', formData);
            const savedPost = res.data.data;

            setPosts([savedPost, ...posts]);
            socket.emit('send_post', savedPost);
            
            setNewPost('');
            setImageFile(null);
        } catch (error) {
            console.error("Lỗi khi đăng bài:", error);
            alert("Có lỗi xảy ra khi đăng bài!");
        }
    };

    const handleLike = async (postId) => {
        if (!userId) return alert("⚠️ Bạn cần đăng nhập!");
        try {
            const res = await api.put(`/posts/${postId}/like`, { userId });
            const updatedLikes = res.data.data;

            setPosts(posts.map(p => p._id === postId ? { ...p, likes: updatedLikes } : p));
            socket.emit('send_like', { postId, likes: updatedLikes });
        } catch (error) {
            console.error("Lỗi thả tim:", error);
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleCommentSubmit = async (postId) => {
        if (!userId) return alert("⚠️ Bạn cần đăng nhập!");
        
        const text = commentInputs[postId] || '';
        const cmtImage = commentImages[postId];

        if (!text.trim() && !cmtImage) return;

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            if (text.trim()) formData.append('text', text);
            if (cmtImage) formData.append('file', cmtImage); 

            const res = await api.post(`/posts/${postId}/comment`, formData);
            const savedComment = res.data.data;

            setPosts(posts.map(p => {
                if (p._id === postId) {
                    return { ...p, comments: [...(p.comments || []), savedComment] };
                }
                return p;
            }));

            socket.emit('send_comment', { postId, newComment: savedComment });

            setCommentInputs({ ...commentInputs, [postId]: '' });
            setCommentImages({ ...commentImages, [postId]: null });
            setShowEmojis({ ...showEmojis, [postId]: false });

        } catch (error) {
            console.error("Lỗi bình luận:", error);
            alert("Lỗi khi gửi bình luận!");
        }
    };

    const handleReport = (postId) => {
        if(window.confirm("Bạn có chắc chắn muốn báo cáo bài viết này?")) {
            alert("Đã gửi báo cáo!");
        }
    };

    const insertEmoji = (postId, emoji) => {
        const currentText = commentInputs[postId] || '';
        setCommentInputs({ ...commentInputs, [postId]: currentText + emoji });
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
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
                    <span style={{ fontWeight: '500', color: '#333' }}>Xin chào, <span style={{ color: '#1a5f7a', fontWeight: 'bold' }}>{userInfo.fullName || userInfo?.user?.fullName || 'Bạn'}</span></span>
                    <button onClick={() => {localStorage.clear(); navigate('/')}} style={logoutBtnStyle}>Đăng xuất</button>
                </div>
            </nav>

            <div style={{ maxWidth: '680px', margin: '30px auto', padding: '0 15px', paddingBottom: '50px' }}>
                
                <div style={createPostCardStyle}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={avatarLgStyle}>{userInfo.fullName?.charAt(0) || userInfo?.user?.fullName?.charAt(0) || 'U'}</div>
                        <textarea 
                            value={newPost} 
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder={`Việt ơi, bạn đang muốn thảo luận về chủ đề gì?`}
                            style={textareaStyle}
                        />
                    </div>
                    
                    {imageFile && <div style={{marginLeft: '60px', marginTop: '10px', color: '#28a745', fontSize: '14px', fontWeight: 'bold'}}>📸 Đã đính kèm: {imageFile.name}</div>}

                    <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{cursor: 'pointer', color: '#1877f2', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{display: 'none'}} />
                            🖼️ Thêm Ảnh
                        </label>
                        <button onClick={handlePost} style={btnStyle} disabled={!newPost.trim() && !imageFile}>🚀 Đăng chủ đề mới</button>
                    </div>
                </div>

                {posts.length > 0 ? posts.map(post => {
                    const isLikedByMe = post.likes?.includes(userId);
                    
                    return (
                    <div key={post._id} style={postCardStyle}>
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
                        
                        {post.content && (
                            <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#1c1e21', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
                                {post.content}
                            </p>
                        )}

                        {post.image && (
                            <div style={{marginBottom: '15px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee'}}>
                                <img src={`http://localhost:3000${post.image}`} alt="Bài đăng" style={{width: '100%', display: 'block'}} />
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#65676b', fontSize: '14px', borderBottom: '1px solid #ebedf0', paddingBottom: '10px', marginBottom: '10px' }}>
                            <span>👍 {post.likes?.length || 0} lượt thích</span>
                            <span style={{cursor: 'pointer'}} onClick={() => toggleComments(post._id)}>
                                💬 {post.comments?.length || 0} bình luận
                            </span>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-around', gap: '10px', padding: '5px 0'}}>
                            <button onClick={() => handleLike(post._id)} style={{...actionBtnStyle, color: isLikedByMe ? '#1877f2' : '#65676b'}}>
                                {isLikedByMe ? '👍 Đã Thích' : '👍 Thích'}
                            </button>
                            <button onClick={() => toggleComments(post._id)} style={actionBtnStyle}>💬 Bình luận</button>
                        </div>

                        {/* --- KHU VỰC BÌNH LUẬN --- */}
                        {expandedComments[post._id] && (
                            <div style={commentSectionStyle}>
                                {post.comments && post.comments.map((cmt, idx) => (
                                    <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                                        <div style={{...avatarMdStyle, width: '32px', height: '32px', fontSize: '14px'}}>{cmt.user?.fullName?.charAt(0) || 'U'}</div>
                                        <div style={{ maxWidth: '85%' }}>
                                            <div style={{ backgroundColor: '#f0f2f5', padding: '8px 12px', borderRadius: '15px', display: 'inline-block' }}>
                                                <b style={{fontSize: '13px', display: 'block', marginBottom: '3px'}}>{cmt.user?.fullName || 'Thành viên'}</b>
                                                {cmt.text && <span style={{fontSize: '14px', whiteSpace: 'pre-wrap'}}>{cmt.text}</span>}
                                            </div>
                                            {cmt.image && (
                                                <div style={{marginTop: '5px'}}>
                                                    <img src={`http://localhost:3000${cmt.image}`} alt="ảnh cmt" style={{maxWidth: '200px', borderRadius: '10px', border: '1px solid #ccc'}}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {commentImages[post._id] && <div style={{marginLeft: '45px', color: '#28a745', fontSize: '12px', fontWeight: 'bold'}}>📸 Đã chọn: {commentImages[post._id].name}</div>}

                                {showEmojis[post._id] && (
                                    <div style={{marginLeft: '45px', marginBottom: '5px', background: 'white', border: '1px solid #ddd', padding: '5px', borderRadius: '20px', display: 'inline-flex', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                                        {EMOJIS.map(emo => (
                                            <span key={emo} style={{cursor: 'pointer', fontSize: '18px'}} onClick={() => insertEmoji(post._id, emo)}>{emo}</span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px', alignItems: 'center' }}>
                                    <div style={{...avatarMdStyle, width: '36px', height: '36px'}}>{userInfo.fullName?.charAt(0) || 'U'}</div>
                                    <div style={{ display: 'flex', flex: 1, backgroundColor: '#f0f2f5', borderRadius: '20px', padding: '5px 15px', alignItems: 'center' }}>
                                        
                                        <span style={{cursor: 'pointer', marginRight: '8px', fontSize: '18px'}} onClick={() => setShowEmojis({...showEmojis, [post._id]: !showEmojis[post._id]})}>😀</span>
                                        
                                        <input 
                                            type="text" 
                                            placeholder="Viết bình luận của bạn..." 
                                            value={commentInputs[post._id] || ''}
                                            onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '14px' }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(post._id); }}
                                        />
                                        
                                        <label style={{cursor: 'pointer', marginLeft: '10px', fontSize: '18px'}} title="Đính kèm ảnh">
                                            <input type="file" accept="image/*" onChange={(e) => setCommentImages({...commentImages, [post._id]: e.target.files[0]})} style={{display: 'none'}} />
                                            📷
                                        </label>

                                        <button onClick={() => handleCommentSubmit(post._id)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#1877f2', fontWeight: 'bold', marginLeft: '10px'}}>Gửi</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
                }) : (
                    <div style={{textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '10px', color: '#666', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                        <span style={{fontSize: '40px', display: 'block', marginBottom: '15px'}}>🚀</span>
                        Chưa có chủ đề nào được thảo luận. Hãy là người đầu tiên bóc tem!
                    </div>
                )}
            </div>
        </div>
    );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: '10px' };
const linkStyle = { cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s', whiteSpace: 'nowrap' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };

const createPostCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #e1e4e8' };
const textareaStyle = { width: '100%', border: 'none', outline: 'none', resize: 'none', height: '60px', fontSize: '16px', backgroundColor: '#f0f2f5', borderRadius: '15px', padding: '15px 20px', boxSizing: 'border-box' };
const btnStyle = { backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' };

const postCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e1e4e8' };
const actionBtnStyle = { flex: 1, backgroundColor: 'transparent', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', color: '#65676b' };
const reportBtnStyle = { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', opacity: 0.5, transition: '0.2s' };

const commentSectionStyle = { borderTop: '1px solid #ebedf0', marginTop: '10px', paddingTop: '15px' };

const avatarLgStyle = { width: '45px', height: '45px', minWidth: '45px', backgroundColor: '#1a5f7a', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' };
const avatarMdStyle = { width: '40px', height: '40px', minWidth: '40px', backgroundColor: '#3498db', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' };

export default Forum;