import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id;

    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({ customerName: '', phone: '', email: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/carts/${userId}`).then(res => setCart(res.data.data || []));
    }, [userId]);

    const total = cart.reduce((sum, i) => sum + (i.book?.price || 0) * i.quantity, 0);
    const shipping = (total > 1000000 && cart.length >= 2) ? 0 : 30000;
    const grandTotal = total + shipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/orders/submit', {
                user: userId,
                ...form,
                paymentMethod
            });
            if (res.data.success) {
                if (res.data.data.payUrl) {
                    window.location.href = res.data.data.payUrl;
                } else {
                    navigate('/order-confirmation?success=true&message=Đơn hàng COD đã được đặt thành công!');
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi thanh toán");
        } finally {
            setLoading(false);
        }
    };

    // === TEST MO MO THÀNH CÔNG (chỉ dùng khi dev) ===
    const handleTestMoMoSuccess = async () => {
        setLoading(true);
        try {
            await api.post('/orders/test-momo-success', { user: userId });
            navigate('/order-confirmation?success=true&message=✅ Thanh toán MoMo thành công (TEST MODE)');
        } catch (err) {
            alert("Không tìm thấy đơn hàng để test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f4f7f6', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '30px' }}>
                {/* LEFT */}
                <div style={{ flex: 2 }}>
                    <h1 style={{ color: '#1a5f7a', marginBottom: '20px' }}>Thanh toán</h1>
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h3>Thông tin nhận hàng</h3>
                        <input placeholder="Họ và tên" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required style={inputStyle} />
                        <input placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={inputStyle} />
                        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inputStyle} />
                        <input placeholder="Địa chỉ giao hàng" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required style={inputStyle} />

                        <h3 style={{ margin: '25px 0 15px 0' }}>Phương thức thanh toán</h3>
                        <label style={paymentOption}>
                            <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Thanh toán tại chỗ (COD)
                        </label>
                        <label style={paymentOption}>
                            <input type="radio" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} /> Thanh toán MoMo
                        </label>

                        <button type="submit" disabled={loading} style={submitBtn}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                        </button>

                        {/* NÚT TEST MO MO - CHỈ HIỂN THỊ KHI CHỌN MOMO */}
                        {paymentMethod === 'momo' && (
                            <button
                                type="button"
                                onClick={handleTestMoMoSuccess}
                                style={{ ...submitBtn, background: '#17a2b8', marginTop: '12px' }}
                            >
                                🧪 TEST - MoMo Thành Công (Dev)
                            </button>
                        )}
                    </form>
                </div>

                {/* RIGHT - Tóm tắt đơn hàng */}
                <div style={{ flex: 1 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
                        <h3>Đơn hàng của bạn</h3>
                        {cart.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
                                <span>{item.quantity}x {item.book?.title}</span>
                                <span style={{ fontWeight: 'bold' }}>{((item.book?.price || 0) * item.quantity).toLocaleString('vi-VN')} ₫</span>
                            </div>
                        ))}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tạm tính</span>
                            <span>{total.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span>Phí vận chuyển</span>
                            <span style={{ color: shipping === 0 ? '#28a745' : '#333' }}>
                                {shipping === 0 ? 'Miễn phí' : '30.000 ₫'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', marginTop: '20px', color: '#e74c3c' }}>
                            <span>TỔNG CỘNG</span>
                            <span>{grandTotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc' };
const paymentOption = { display: 'block', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' };
const submitBtn = { width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };

export default Checkout;