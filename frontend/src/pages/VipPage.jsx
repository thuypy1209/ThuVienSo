// src/pages/VipPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/VipPage.css'; 

const VipPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State để tạo hiệu ứng chờ

  // 🚀 HÀM XỬ LÝ THANH TOÁN THẬT QUA JAVA
  const handleRealPayment = async () => {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:8080/api/payment/momo?amount=20000', {
            method: 'POST'
        });

        // 🚀 BƯỚC BẮT BỆNH: Nếu Java báo lỗi (mã 400, 500)
        if (!response.ok) {
            const errorText = await response.text(); // Lấy lỗi dạng chữ
            alert("❌ Lỗi từ Backend Java: " + errorText);
            setLoading(false);
            return;
        }

        const data = await response.json();

        if (data && data.payUrl) {
            window.location.href = data.payUrl; 
        } else {
            alert("❌ Lỗi từ MoMo: " + (data.message || JSON.stringify(data)));
        }
    } catch (error) {
        alert("❌ Lỗi mạng: Chưa bật Backend hoặc bị lỗi CORS!");
        console.error("Chi tiết lỗi:", error);
    }
    setLoading(false);
  };

  return (
    <div className="momo-payment-screen">
      {/* 1. HEADER CHUẨN MOMO (Màu xám đậm) */}
      <header className="momo-header">
        <button className="momo-back-btn" onClick={() => navigate('/books')}>
          &#x2190; {/* Icon mũi tên quay lại */}
        </button>
        <span className="momo-header-title">Chuyển tiền MoMo</span>
        <div className="momo-header-spacer"></div>
      </header>

      {/* 2. NỘI DUNG CHÍNH (Vùng màu hồng nhạt) */}
      <main className="momo-content">
        
        {/* CÁI CARD THANH TOÁN TO ĐÙNG MÀU TRẮNG */}
        <div className="momo-card">
          
          {/* A. THÔNG TIN NGƯỜI NHẬN (Thư viện HUTECH) */}
          <div className="momo-receiver-section">
            <div className="momo-avatar-hutech">🎓</div>
            <div className="momo-receiver-info">
              <span className="momo-receiver-name">Thư viện kỹ thuật số HUTECH</span>
              <span className="momo-receiver-phone">0342723733</span>
            </div>
          </div>

          {/* B. SỐ TIỀN THANH TOÁN (To, rõ ràng y chang hình) */}
          <div className="momo-amount-section">
            <span className="momo-amount-label">Số tiền chuyển</span>
            <span className="momo-amount-value">20.000đ</span>
          </div>

          {/* C. LỜI NHẮN / GÓI VIP */}
          <div className="momo-note-section">
            <span className="momo-note-label">Lời nhắn</span>
            <div className="momo-note-box">
              <strong>Nâng cấp VIP Sinh viên (Vĩnh viễn)</strong>
              <p>Hệ thống HUTECH DIGILIB sẽ tự động mở khóa sách ngay sau khi thanh toán.</p>
            </div>
          </div>

          {/* D. MÃ QR MINH HỌA */}
          <div className="momo-qr-section">
            <h3 className="momo-qr-title">Xác nhận thanh toán an toàn</h3>
            <p className="momo-scan-instruction" style={{ color: '#888', fontStyle: 'italic', marginBottom: '10px' }}>
              Hệ thống sẽ chuyển hướng đến cổng MoMo chính thức.
            </p>
          </div>

          {/* E. FOOTER CỦA CARD (Thông tin giao dịch) */}
          <div className="momo-card-footer">
            <span>Dịch vụ: Nâng cấp VIP Library</span>
            <span>Mã giao dịch: HT{new Date().getTime()}</span>
          </div>
        </div>

        {/* 3. NÚT XÁC NHẬN CHÍNH THỨC */}
        <div className="momo-action-bar">
          <button 
            className="btn-momo-confirm" 
            onClick={handleRealPayment} 
            disabled={loading}
          >
            {loading ? "⏳ Đang kết nối MoMo..." : "Xác Nhận & Thanh Toán"}
          </button>
          <button className="btn-momo-later" onClick={() => navigate('/books')} disabled={loading}>
            Để sau
          </button>
        </div>

      </main>
    </div>
  );
};

export default VipPage;