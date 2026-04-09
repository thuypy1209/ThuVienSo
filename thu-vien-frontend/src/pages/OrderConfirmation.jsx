import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const success = searchParams.get('success') === 'true';
    const message = searchParams.get('message') || (success ? 'Đơn hàng đã được đặt thành công!' : 'Thanh toán thất bại');

    return (
        <div style={{ background: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                background: 'white',
                padding: '50px 40px',
                borderRadius: '16px',
                textAlign: 'center',
                maxWidth: '500px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                {success ? (
                    <>
                        <h1 style={{ fontSize: '60px', color: '#28a745', margin: '0 0 20px 0' }}>🎉</h1>
                        <h2 style={{ color: '#28a745' }}>Thanh toán thành công!</h2>
                    </>
                ) : (
                    <>
                        <h1 style={{ fontSize: '60px', color: '#e74c3c', margin: '0 0 20px 0' }}>❌</h1>
                        <h2 style={{ color: '#e74c3c' }}>Thanh toán thất bại</h2>
                    </>
                )}
                <p style={{ fontSize: '18px', margin: '20px 0 30px 0' }}>{message}</p>
                <button 
                    onClick={() => navigate('/home')}
                    style={{ padding: '14px 40px', background: '#1a5f7a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;