import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const AuthorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetailData = async () => {
            try {
                setLoading(true);
                const authorRes = await api.get(`/authors/${id}`);
                setAuthor(authorRes.data.data);
                
                const booksRes = await api.get(`/books?authorId=${id}`);
                setAuthorBooks(booksRes.data.data);
                
            } catch (error) {
                console.error("Lỗi lấy dữ liệu chi tiết tác giả:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailData();
    }, [id]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải hồ sơ tác giả...</div>;
    if (!author) return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Không tìm thấy thông tin tác giả!</div>;

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            
            <div className="container" style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
                <button onClick={() => navigate('/authors-list')} style={{ background: 'transparent', border: 'none', color: '#1a5f7a', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' }}>
                    ⬅ Quay lại danh sách
                </button>

                {/* --- PROFILE TÁC GIẢ --- */}
                <div style={{ display: 'flex', gap: '30px', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <div style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, #1a5f7a, #3498db)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(26,95,122,0.4)' }}>
                        {author.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '36px', color: '#2c3e50', margin: '0 0 10px 0' }}>{author.name}</h1>
                        <span style={{ background: '#fff3cd', color: '#856404', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                            Năm sinh: {author.birthYear || 'Đang cập nhật'}
                        </span>
                        <h4 style={{ marginTop: '20px', color: '#1a5f7a' }}>Tiểu sử:</h4>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '16px', textAlign: 'justify' }}>
                            {author.biography || 'Hiện chưa có thông tin tiểu sử chi tiết về tác giả này trên hệ thống.'}
                        </p>
                    </div>
                </div>

                {/* --- SÁCH CỦA TÁC GIẢ --- */}
                <h2 style={{ fontSize: '24px', color: '#1a5f7a', marginBottom: '20px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' }}>
                    📚 Các tác phẩm của {author.name} ({authorBooks.length} cuốn)
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {authorBooks.length > 0 ? authorBooks.map(book => (
                        <div key={book._id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <img src={book.coverImage || "https://via.placeholder.com/200x280.png?text=Sách+HUTECH"} alt={book.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#333' }}>{book.title}</h4>
                                <button onClick={() => navigate(`/doc-sach/${book._id}`)} style={{ width: '100%', background: '#28a745', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>📖 Đọc ngay</button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', color: '#666' }}>
                            Chưa có sách nào của tác giả này được cập nhật lên hệ thống.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthorDetail;