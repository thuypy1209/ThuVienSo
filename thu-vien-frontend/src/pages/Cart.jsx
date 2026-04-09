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

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/carts/${userId}`);
            setCartItems(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.put(`/carts/${cartId}`, { quantity: newQuantity });
            fetchCart();
        } catch (err) {
            alert("Lỗi cập nhật số lượng!");
        }
    };

    const handleRemove = async (cartId) => {
        if (!window.confirm("Xóa sách này khỏi giỏ?")) return;
        try {
            await api.delete(`/carts/${cartId}`);
            fetchCart();
        } catch (err) {
            alert("Lỗi khi xóa!");
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.book?.price || 0) * (item.quantity || 1);
    }, 0);

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px' }}>
            <nav className="navbar" style={navStyle}>
                {/* navbar giữ nguyên như code cũ của bạn */}
                <div className="nav-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    📚 HUTECH Library
                </div>
                {/* ... phần nav-links và user giữ nguyên ... */}
            </nav>

            <div className="container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#1a5f7a', marginBottom: '30px' }}>
                    🛒 Giỏ hàng của bạn ({cartItems.length})
                </h2>

                {loading ? <div style={{textAlign: 'center', padding: '50px'}}>⏳ Đang tải giỏ hàng...</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {cartItems.length > 0 ? cartItems.map(item => {
                            const book = item.book || {};
                            return (
                                <div key={item._id} style={cartItemStyle}>
                                    <img 
                                        src={book.coverImage ? `http://localhost:3000${book.coverImage}` : "https://via.placeholder.com/100x150?text=Sách"} 
                                        alt={book.title} 
                                        style={imgStyle} 
                                    />
                                    <div style={{ flex: 1, padding: '0 20px' }}>
                                        <h3 style={{ margin: '0 0 8px 0' }}>{book.title}</h3>
                                        <p style={{ color: '#666', margin: '0 0 10px 0' }}>Giá: <b>{(book.price || 0).toLocaleString('vi-VN')} ₫</b></p>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} style={qtyBtn}>-</button>
                                            <span style={{ fontSize: '18px', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} style={qtyBtn}>+</button>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                                            {((book.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                                        </p>
                                        <button onClick={() => handleRemove(item._id)} style={removeBtnStyle}>🗑️ Xóa</button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px' }}>
                                <p style={{ fontSize: '18px', color: '#666' }}>Giỏ hàng trống</p>
                                <button onClick={() => navigate('/tu-sach')} style={{ marginTop: '20px', background: '#1a5f7a', color: 'white', padding: '12px 30px', borderRadius: '8px' }}>
                                    Đi mua sách ngay
                                </button>
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Tổng cộng: <span style={{ color: '#e74c3c' }}>{totalAmount.toLocaleString('vi-VN')} ₫</span></h3>
                                <button 
                                    onClick={() => navigate('/checkout')}
                                    style={{ background: '#28a745', color: 'white', padding: '15px 35px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold' }}
                                >
                                    Vào trang thanh toán →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const navStyle = { /* giữ nguyên style navbar cũ của bạn */ };
const cartItemStyle = { display: 'flex', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' };
const imgStyle = { width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px' };
const qtyBtn = { width: '30px', height: '30px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' };
const removeBtnStyle = { background: '#ffebee', color: '#e74c3c', border: '1px solid #ffcdd2', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };

export default Cart;