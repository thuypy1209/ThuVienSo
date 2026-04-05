import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await api.get(`/books/${id}`);
                const data = res.data.data;
                setBook(data);
                if (data?.fileUrl) {
                    // API thật trỏ tới thư mục tĩnh trên server Node.js
                    setPdfUrl(`http://localhost:3000/uploads/${data.fileUrl}`);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFile();
    }, [id]);

    if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>⏳ Đang chuẩn bị trang sách...</div>;

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#525659' }}>
            <div style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Đang đọc: <b>{book?.title}</b></span>
                <button onClick={() => navigate(-1)} style={{ background: '#e74c3c', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Đóng</button>
            </div>
            
            <div style={{ flex: 1 }}>
                {pdfUrl ? (
                    <iframe 
                        src={`${pdfUrl}#toolbar=0`} // #toolbar=0 để hạn chế sinh viên tải lậu file
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none' }}
                        title="HUTECH PDF Reader"
                    ></iframe>
                ) : (
                    <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
                        <h3>⚠️ Cuốn sách này chưa có phiên bản PDF.</h3>
                        <p>Ní vui lòng liên hệ thủ thư hoặc mượn sách giấy nhé!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadBook;