import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';
import ChatBox from '../components/ChatBox';

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books');
            if (res.data.success) {
                setBooks(res.data.data);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách sách:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchBooks();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* HEADER */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #eee',
                paddingBottom: '10px'
            }}>
                <h1 style={{ color: '#007bff' }}>📚 THƯ VIỆN SỐ HUTECH</h1>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/forum')} style={forumBtnStyle}>
                        🏛️ Diễn đàn
                    </button>

                    <button onClick={() => navigate('/authors-list')} style={forumBtnStyle}>
                        ✍️ Tác giả
                    </button>

                    <button onClick={() => navigate('/publishers')} style={forumBtnStyle}>
                        🏢 NXB
                    </button>

                    <button onClick={() => navigate('/borrow-history')} style={forumBtnStyle}>
                        📋 Lịch sử mượn
                    </button>

                    <button onClick={() => navigate('/wishlist')} style={forumBtnStyle}>
                        ❤️ Yêu thích
                    </button>

                    <button onClick={() => navigate('/cart')} style={forumBtnStyle}>
                        🛒 Giỏ sách
                    </button>

                    <button onClick={() => navigate('/notifications')} style={forumBtnStyle}>
                        🔔 Thông báo
                    </button>

                    <button onClick={() => navigate('/bookshelf')} style={forumBtnStyle}>
                        📚 Tủ sách
                    </button>

                    {(userInfo.role === 'Admin' || userInfo.role === 'Thủ thư') && (
                        <button
                            onClick={() => navigate('/quan-ly-sach')}
                            style={{ ...forumBtnStyle, backgroundColor: '#ffc107', color: '#000' }}
                        >
                            📖 Quản lý sách
                        </button>
                    )}

                    <button onClick={handleLogout} style={logoutBtnStyle}>
                        Đăng xuất
                    </button>
                </div>
            </div>

            <h2 style={{ marginTop: '20px' }}>Sách mới cập nhật</h2>

            {loading ? (
                <p>Đang tải dữ liệu sách...</p>
            ) : (
                <div style={bookGridStyle}>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book._id} style={bookCardStyle}>
                                <img
                                    src={
                                        book.coverImage
                                            ? `${BASE_URL}${book.coverImage}`
                                            : "https://via.placeholder.com/150x200?text=No+Cover"
                                    }
                                    alt={book.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '5px'
                                    }}
                                />
                                <h4 style={{ margin: '10px 0 5px 0', fontSize: '16px' }}>
                                    {book.title}
                                </h4>
                                <p style={{ fontSize: '13px', color: '#666' }}>
                                    Tác giả: {book.author || "Chưa cập nhật"}
                                </p>
                                <button
                                    onClick={() => navigate(`/doc-sach/${book._id}`)}
                                    style={readBtnStyle}
                                >
                                    Đọc trực tuyến
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Thư viện hiện chưa có cuốn sách nào.</p>
                    )}
                </div>
            )}
            <ChatBox />
        </div>
    );
};


const bookGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' };
const bookCardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff' };
const readBtnStyle = { marginTop: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' };
const logoutBtnStyle = { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const forumBtnStyle = { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Home;