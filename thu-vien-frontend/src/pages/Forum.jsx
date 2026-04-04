import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // Lấy danh sách bài đăng khi vào trang
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await api.get('/messages'); // Tận dụng route cũ hoặc tạo mới /posts
            setPosts(res.data.data);
        };
        fetchPosts();

        socket.on('receive_post', (data) => {
            setPosts((prev) => [data, ...prev]);
        });
        return () => socket.off('receive_post');
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        // Gửi bài đăng mới qua Socket hoặc API
        socket.emit('send_post', {
            sender: userInfo._id,
            content: newPost,
        });
        setNewPost('');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '10px' }}>
            <h2 style={{textAlign: 'center', color: '#007bff'}}>📣 DIỄN ĐÀN THẢO LUẬN</h2>
            
            {/* Form đăng bài giống Status Facebook */}
            <div style={cardStyle}>
                <textarea 
                    value={newPost} 
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={`Việt ơi, bạn đang thắc mắc gì thế?`}
                    style={textareaStyle}
                />
                <button onClick={handlePost} style={btnStyle}>Đăng câu hỏi</button>
            </div>

            {/* Danh sách các bài đăng */}
            {posts.map(post => (
                <div key={post._id} style={cardStyle}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <div style={avatarStyle}>{post.sender?.fullName?.charAt(0)}</div>
                        <b style={{marginLeft: '10px'}}>{post.sender?.fullName}</b>
                    </div>
                    <p>{post.content}</p>
                    <hr style={{border: '0.5px solid #eee'}} />
                    <div style={{display: 'flex', gap: '20px', color: '#666', fontSize: '14px'}}>
                        <span style={{cursor: 'pointer'}}>👍 Thích</span>
                        <span style={{cursor: 'pointer'}}>💬 Bình luận</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Style nhẹ nhàng kiểu FB ---
const cardStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '15px', border: '1px solid #ddd' };
const textareaStyle = { width: '100%', border: 'none', outline: 'none', resize: 'none', height: '60px', fontSize: '16px' };
const btnStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', float: 'right' };
const avatarStyle = { width: '40px', height: '40px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };

export default Forum;