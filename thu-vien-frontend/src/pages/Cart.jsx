import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        if (!userId) {
            console.error("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!");
            setLoading(false);
            return;
        }

        try {
            const res = await api.get(`/carts/${userId}`);
            setCartItems(res.data.data || []);
        } catch (err) {
            console.error("Lỗi lấy giỏ sách:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            await api.delete(`/carts/${itemId}`);
            setCartItems(cartItems.filter(item => item._id !== itemId));
        } catch (err) {
            alert("Lỗi khi xóa khỏi giỏ!");
        }
    };

    const handleCheckout = async () => {
        if(cartItems.length === 0) return alert("Giỏ sách đang trống!");
        
        // KIỂM TRA TỒN KHO TRƯỚC KHI MƯỢN
        const hasOutOfStock = cartItems.some(item => item.book?.stock === 0);
        if (hasOutOfStock) {
            return alert("⚠️ Có cuốn sách đã hết trong kho. Vui lòng xóa khỏi giỏ để tiếp tục mượn các cuốn khác!");
        }

        try {
            await api.post('/borrow-records/checkout-cart', { user: userId });
            
            alert("🎉 Đăng ký mượn sách thành công! Hãy đến quầy thủ thư để nhận sách.");
            setCartItems([]); 
            navigate('/borrow-history'); 
        } catch (err) {
            alert("Có lỗi xảy ra khi đăng ký mượn!");
        }
    };

    const isCartInvalid = cartItems.some(item => item.book?.stock === 0);

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* --- NAVBAR --- */}
            <nav className="navbar" style={navStyle}>
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                <div className="nav-links" style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#4a4a4a' }}>
                    <span style={linkStyle} onClick={() => navigate('/home')}>🏠 Trang chủ</span>
                    <span style={linkStyle} onClick={() => navigate('/forum')}>💬 Diễn đàn</span>
                    <span style={linkStyle} onClick={() => navigate('/authors-list')}>✍️ Tác giả</span>
                    <span style={linkStyle} onClick={() => navigate('/publishers')}>🏢 NXB</span>
                    <span style={linkStyle} onClick={() => navigate('/borrow-history')}>📋 Mượn sách</span>
                    <span style={linkStyle} onClick={() => navigate('/wishlist')}>❤️ Yêu thích</span>
                    <span style={{...linkStyle, color: '#1a5f7a', fontWeight: 'bold'}} onClick={() => navigate('/cart')}>🛒 Giỏ sách</span>
                    <span style={linkStyle} onClick={() => navigate('/notifications')}>🔔 Thông báo</span>
                </div>
                <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '500', color: '#333' }}>Xin chào, <span style={{ color: '#1a5f7a', fontWeight: 'bold' }}>{userInfo.fullName || userInfo?.user?.fullName || 'Bạn'}</span></span>
                    <button onClick={() => {localStorage.clear(); navigate('/')}} style={logoutBtnStyle}>Đăng xuất</button>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#1a5f7a', borderBottom: '2px solid #eaeaea', paddingBottom: '15px', marginBottom: '30px' }}>
                    🛒 Giỏ Sách Chờ Mượn ({cartItems.length})
                </h2>
                
                {loading ? <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>⏳ Đang kiểm tra giỏ sách...</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {cartItems.length > 0 ? cartItems.map(item => {
                            const book = item.book;
                            if (!book) return null;
                            
                            const stock = book.stock !== undefined ? book.stock : 5; 
                            const isOutOfStock = stock <= 0;

                            return (
                                <div key={item._id} style={cartItemStyle}>
                                    <img src={book.coverImage || "https://via.placeholder.com/100x150?text=Sách"} alt={book.title} style={imgStyle} />
                                    
                                    <div style={{ flex: 1, padding: '0 20px' }}>
                                        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '20px' }}>{book.title}</h3>
                                        <p style={{ margin: '0 0 8px 0', color: '#666' }}>✍️ Tác giả: <b>{book.author?.name || 'Ẩn danh'}</b></p>
                                        
                                        {isOutOfStock ? (
                                            <span style={{ background: '#fee', color: '#e74c3c', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                                                ❌ Đã hết sách trong kho
                                            </span>
                                        ) : (
                                            <span style={{ background: '#e6f4ea', color: '#28a745', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                                                ✅ Còn {stock} cuốn trong kho
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button onClick={() => handleRemoveFromCart(item._id)} style={removeBtnStyle}>
                                            🗑️ Xóa khỏi giỏ
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '50px', display: 'block', marginBottom: '15px' }}>🛒</span>
                                <p style={{ color: '#666', fontSize: '16px' }}>Giỏ sách của bạn đang trống trơn.</p>
                                <button onClick={() => navigate('/home')} style={{ marginTop: '15px', background: '#1a5f7a', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Đi dạo thư viện ngay
                                </button>
                            </div>
                        )}
                        
                        {cartItems.length > 0 && (
                            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 -4px 15px rgba(0,0,0,0.05)', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: '#333' }}>Tổng số lượng: <span style={{ color: '#e74c3c', fontSize: '24px' }}>{cartItems.length}</span> cuốn</h4>
                                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>* Thời hạn mượn mặc định là 14 ngày.</p>
                                </div>
                                <button 
                                    onClick={handleCheckout} 
                                    disabled={isCartInvalid} // Khóa nút nếu có cuốn hết hàng
                                    style={{ 
                                        background: isCartInvalid ? '#ccc' : '#28a745', 
                                        color: 'white', border: 'none', padding: '15px 30px', 
                                        borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', 
                                        cursor: isCartInvalid ? 'not-allowed' : 'pointer',
                                        boxShadow: isCartInvalid ? 'none' : '0 4px 15px rgba(40,167,69,0.3)',
                                        transition: '0.3s'
                                    }}
                                >
                                    ✅ Lên Đơn Mượn Sách
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const linkStyle = { cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };

const cartItemStyle = { display: 'flex', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', transition: 'transform 0.2s' };
const imgStyle = { width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const removeBtnStyle = { background: '#ffebee', color: '#e74c3c', border: '1px solid #ffcdd2', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };

export default Cart;