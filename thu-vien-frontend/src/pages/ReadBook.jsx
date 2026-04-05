import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate('/');
            return;
        }
        if (!id) {
            alert("Không tìm thấy ID sách");
            navigate('/home');
            return;
        }

        api.get(`/books/${id}`)
            .then(res => {
                if (res.data.success) {
                    const book = res.data.data;
                    if (book.fileUrl) {
                        setPdfUrl(`${BASE_URL}${book.fileUrl}#toolbar=0`);
                    } else {
                        alert("Sách này chưa có file PDF/EPUB!");
                        navigate('/home');
                    }
                }
            })
            .catch(() => {
                alert("Không tìm thấy sách hoặc lỗi server");
                navigate('/home');
            });
    }, [id, navigate]);

    return (
        <div 
            onContextMenu={(e) => { e.preventDefault(); alert("⚠️ Tải xuống đã bị khóa!"); }}
            style={{ width: '100vw', height: '100vh', backgroundColor: '#333' }}
        >
            <h3 style={{ color: 'white', textAlign: 'center', padding: '10px 0', margin: 0 }}>
                📖 Đang đọc: {pdfUrl ? 'Sách của bạn' : 'Đang tải...'}
            </h3>

            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="90%"
                    style={{ border: 'none' }}
                    title="Đọc sách online"
                />
            )}
        </div>
    );
};

export default ReadBook;