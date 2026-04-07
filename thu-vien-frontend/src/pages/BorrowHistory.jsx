import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import '../css/Borrow.css'; 

const BorrowHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?._id || userInfo?.id || userInfo?.user?._id || userInfo?.data?._id;

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) {
                console.error("Không tìm thấy ID người dùng để lấy lịch sử!");
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(`/borrow-records/my-history/${userId}`); 
                setRecords(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy lịch sử mượn:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [userId]);

    const getStatusColor = (status) => {
        if (status === 'Đang mượn') return '#007bff';
        if (status === 'Đã trả') return '#28a745';
        if (status === 'Quá hạn') return '#dc3545';
        return '#666';
    };

    return (
        <div className="borrow-container">
            <h2>📋 Lịch sử mượn sách của bạn</h2>
            <p className="sub-title">Theo dõi thời hạn trả sách để tránh bị phạt nhé, {userInfo.fullName || 'Việt'}!</p>

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
                                        {/* Hiển thị tên sách từ dữ liệu thật đã Populate */}
                                        <b>{item.book?.title || 'Sách không còn tồn tại'}</b>
                                    </td>
                                    <td>{item.borrowDate ? new Date(item.borrowDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                    <td style={{fontWeight: 'bold', color: item.status === 'Quá hạn' ? 'red' : 'inherit'}}>
                                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
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