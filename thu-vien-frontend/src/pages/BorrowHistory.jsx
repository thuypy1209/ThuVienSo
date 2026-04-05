import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import '../css/Borrow.css'; // Sẽ tạo file này ở bước 2

const BorrowHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Gọi API lấy lịch sử mượn của chính User đang đăng nhập
                const res = await api.get('/borrow-records/my-history'); 
                setRecords(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy lịch sử mượn:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Hàm đổi màu theo trạng thái
    const getStatusColor = (status) => {
        if (status === 'Đang mượn') return '#007bff'; // Xanh dương
        if (status === 'Đã trả') return '#28a745';    // Xanh lá
        if (status === 'Quá hạn') return '#dc3545';   // Đỏ
        return '#666';
    };

    return (
        <div className="borrow-container">
            <h2>📋 Lịch sử mượn sách của bạn</h2>
            <p className="sub-title">Theo dõi thời hạn trả sách để tránh bị phạt nhé, Việt!</p>

            {loading ? <div className="loader">Đang kiểm tra kho dữ liệu...</div> : (
                <div className="borrow-table-wrapper">
                    <table className="borrow-table">
                        <thead>
                            <tr>
                                <th>Tên sách</th>
                                <th>Ngày mượn</th>
                                <th>Hạn trả (Due Date)</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? records.map(item => (
                                <tr key={item._id}>
                                    <td className="book-title-cell">
                                        <b>{item.book?.title || 'Sách đã xóa'}</b>
                                    </td>
                                    <td>{new Date(item.borrowDate).toLocaleDateString('vi-VN')}</td>
                                    <td style={{fontWeight: 'bold', color: item.status === 'Quá hạn' ? 'red' : 'inherit'}}>
                                        {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>
                                        <span className="status-badge" style={{ backgroundColor: getStatusColor(item.status) }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {item.status === 'Đang mượn' && (
                                            <button className="btn-return">Yêu cầu trả</button>
                                        )}
                                        <button className="btn-detail">Chi tiết</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>
                                        Bạn chưa mượn cuốn sách nào. Đi mượn ngay thôi!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BorrowHistory;