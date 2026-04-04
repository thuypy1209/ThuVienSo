import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Thư viện gọi API đã có sẵn Token
import ChatBox from '../components/ChatBox';

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]); // Hộp chứa danh sách sách
    const [loading, setLoading] = useState(true);

    // 1. Hàm lấy sách từ Backend
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
        // Kiểm tra xem đã đăng nhập chưa, chưa thì đá ra ngoài
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchBooks();
    }, []);

    // 2. Hàm đăng xuất
    const handleLogout = () => {
        localStorage.clear(); // Xóa sạch Token và UserInfo
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h1 style={{ color: '#007bff' }}>📚 THƯ VIỆN SỐ HUTECH</h1>
                <button onClick={handleLogout} style={logoutBtnStyle}>Đăng xuất</button>
                <button onClick={() => navigate('/forum')} style={forumBtnStyle}>🏛️ Diễn đàn</button>
            </div>

            {/* Danh sách sách */}
            <h2 style={{ marginTop: '20px' }}>Sách mới cập nhật</h2>
            
            {loading ? (
                <p>Đang tải dữ liệu sách...</p>
            ) : (
                <div style={bookGridStyle}>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book._id} style={bookCardStyle}>
                                {/* Nếu có ảnh thì hiện, không thì hiện ảnh tạm */}
                                <img 
                                    src={book.coverImage || "https://via.placeholder.com/150x200?text=No+Cover"} 
                                    alt={book.title} 
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                                <h4 style={{ margin: '10px 0 5px 0', fontSize: '16px' }}>{book.title}</h4>
                                <p style={{ fontSize: '13px', color: '#666' }}>Tác giả: {book.author?.fullName || "Chưa cập nhật"}</p>
                                <button 
                                    onClick={() => navigate('/doc-sach')}
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

// --- STYLE CHO GIAO DIỆN ---
const bookGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px',
    marginTop: '20px'
};

const bookCardStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
};

const readBtnStyle = {
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
};

const logoutBtnStyle = {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default Home;