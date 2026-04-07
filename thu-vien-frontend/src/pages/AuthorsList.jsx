import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const AuthorsList = () => {
    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await api.get('/authors');
                setAuthors(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy tác giả:", err);
                setError('Không thể tải danh sách tác giả lúc này!');
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    const filteredAuthors = authors.filter(author => 
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                <div className="nav-links" style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#4a4a4a' }}>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={{cursor: 'pointer', color: '#1a5f7a', fontWeight: 'bold'}} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/borrow-history')}>📋 Mượn sách</span>
                </div>
                <div className="nav-user">
                    <span>Chào, <b>{userInfo.fullName || 'Bạn'}</b></span>
                    <button className="btn-logout" onClick={() => {localStorage.clear(); navigate('/')}} style={{ marginLeft: '15px', background: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Thoát</button>
                </div>
            </nav>

            {/* --- NỘI DUNG CHÍNH --- */}
            <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h2 className="section-title" style={{ margin: 0, color: '#1a5f7a' }}>✍️ Danh sách Tác giả</h2>
                        <p style={{color: '#666', margin: '5px 0 0 0'}}>Khám phá tiểu sử và các tác phẩm nổi bật.</p>
                    </div>
                    
                    {/*TÌM KIẾM TÁC GIẢ */}
                    <div style={{ display: 'flex', background: 'white', borderRadius: '30px', padding: '5px 15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', width: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="🔍 Tìm tên tác giả..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', flex: 1, padding: '8px 5px', fontSize: '15px' }}
                        />
                    </div>
                </div>
                
                {loading && <div className="loader">Đang tải dữ liệu tác giả...</div>}
                {error && <div style={{ color: 'red', padding: '20px', background: '#fee', borderRadius: '8px' }}>{error}</div>}
                
                {!loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                        {filteredAuthors.length > 0 ? filteredAuthors.map(author => (
                            <div 
                                key={author._id} 
                                style={authorCardStyle} 
                                onClick={() => navigate(`/author/${author._id}`)} // BẤM ĐỂ CHUYỂN TRANG
                            >
                                <div style={avatarStyle}>
                                    {author.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={{ margin: '15px 0 5px 0', color: '#2c3e50', fontSize: '18px' }}>{author.name}</h3>
                                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#e67e22', fontWeight: 'bold' }}>
                                    Năm sinh: {author.birthYear || 'Chưa rõ'}
                                </p>
                                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {author.biography || 'Đang cập nhật tiểu sử...'}
                                </p>
                                <button style={{ marginTop: '15px', background: '#f0f2f5', border: 'none', padding: '8px 20px', borderRadius: '20px', color: '#1a5f7a', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                                    Xem chi tiết ➔
                                </button>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
                                😅 Không tìm thấy tác giả nào tên "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const authorCardStyle = { background: 'white', padding: '30px 20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eaeaea', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' };
const avatarStyle = { width: '90px', height: '90px', background: 'linear-gradient(135deg, #1a5f7a, #3498db)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', margin: '0 auto', boxShadow: '0 4px 10px rgba(26,95,122,0.3)' };

export default AuthorsList;