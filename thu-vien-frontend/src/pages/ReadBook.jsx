import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReadBook = () => {
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = useState('');

    // Hàm này chạy ngay khi vừa mở trang web lên
    useEffect(() => {
        // 1. KIỂM TRA QUYỀN (CẤP QUYỀN)
        const token = localStorage.getItem('token');
        if (!token) {
            alert("🛑 Bạn chưa đăng nhập! Vui lòng đăng nhập để đọc sách.");
            navigate('/'); // Đá văng về trang chủ/đăng nhập
            return;
        }

        // 2. GIẢ LẬP GỌI API LẤY FILE SÁCH
        // Ở đây mình ví dụ đường link file PDF từ Backend của bạn.
        // Bạn nhớ thay đổi tên file "test-book.pdf" thành 1 file có thật trong thư mục "uploads" của Backend nhé.
        const urlTuBackend = 'http://localhost:3000/uploads/test-book.pdf';
        
        // Gắn khiên Lớp 1: #toolbar=0 để giấu nút Download
        setPdfUrl(`${urlTuBackend}#toolbar=0`);
    }, [navigate]);

    return (
        <div 
            // Gắn khiên Lớp 2: Khóa chuột phải toàn bộ khu vực đọc sách
            onContextMenu={(e) => {
                e.preventDefault();
                alert("⚠️ Tính năng tải xuống đã bị khóa để bảo vệ bản quyền!");
            }} 
            style={{ width: '100vw', height: '100vh', backgroundColor: '#333' }}
        >
            <h3 style={{ color: 'white', textAlign: 'center', padding: '10px 0', margin: 0 }}>
                📖 Chế độ Đọc Trực Tuyến (Bản quyền thuộc về Thư Viện)
            </h3>
            
            {/* Khung máy chiếu PDF */}
            {pdfUrl && (
                <iframe 
                    src={pdfUrl} 
                    width="100%" 
                    height="90%" 
                    style={{ border: 'none' }}
                    title="Đọc sách online"
                ></iframe>
            )}
        </div>
    );
};

export default ReadBook;