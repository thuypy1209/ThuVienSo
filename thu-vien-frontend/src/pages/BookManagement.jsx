import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';

const BookManagement = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: '', author: '', category: '', description: '', publishedYear: '',
        coverImage: '', fileUrl: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [ebookFile, setEbookFile] = useState(null);
    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        try {
            const [resBooks, resCat] = await Promise.all([
                api.get('/books'),
                api.get('/categories')
            ]);
            setBooks(resBooks.data.data || []);
            setCategories(resCat.data.data || []);
        } catch (err) {
            console.error(err);
            alert("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!token || !['Admin', 'Thủ thư'].includes(user.role)) {
            alert("Bạn không có quyền truy cập trang quản lý!");
            navigate('/home');
            return;
        }
        fetchData();
    }, [navigate]);

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const uploadFile = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/upload', formData);
        return res.data.data.fileUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let coverUrl = form.coverImage;
            let ebookUrl = form.fileUrl;

            if (coverFile) coverUrl = await uploadFile(coverFile);
            if (ebookFile) ebookUrl = await uploadFile(ebookFile);

            const bookData = {
                title: form.title,
                author: form.author,
                category: form.category,
                description: form.description,
                publishedYear: Number(form.publishedYear),
                coverImage: coverUrl,
                fileUrl: ebookUrl
            };

            if (editId) {
                await api.put(`/books/${editId}`, bookData);
                alert("Cập nhật sách thành công!");
            } else {
                await api.post('/books', bookData);
                alert("Thêm sách thành công!");
            }

            setForm({ title: '', author: '', category: '', description: '', publishedYear: '', coverImage: '', fileUrl: '' });
            setCoverFile(null);
            setEbookFile(null);
            setEditId(null);
            fetchData();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (book) => {
        setEditId(book._id);
        setForm({
            title: book.title,
            author: book.author,
            category: book.category?._id || book.category,
            description: book.description || '',
            publishedYear: book.publishedYear || '',
            coverImage: book.coverImage || '',
            fileUrl: book.fileUrl || ''
        });
        setCoverFile(null);
        setEbookFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sách này?")) return;
        try {
            await api.delete(`/books/${id}`);
            alert("Xóa thành công!");
            fetchData();
        } catch (err) {
            alert("Lỗi xóa sách");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Quản Lý Sách (Thủ thư / Admin)</h1>
            <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>← Về Trang Chủ</button>

            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px' }}>
                <h3>{editId ? 'Sửa sách' : 'Thêm sách mới'}</h3>
                <input name="title" placeholder="Tên sách" value={form.title} onChange={handleInput} required style={inputStyle} />
                <input name="author" placeholder="Tác giả" value={form.author} onChange={handleInput} required style={inputStyle} />
                <select name="category" value={form.category} onChange={handleInput} required style={inputStyle}>
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleInput} style={inputStyle} />
                <input name="publishedYear" type="number" placeholder="Năm xuất bản" value={form.publishedYear} onChange={handleInput} style={inputStyle} />

                <label>Ảnh bìa (jpg/png):</label>
                <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={inputStyle} />

                <label>File sách (PDF/EPUB):</label>
                <input type="file" accept=".pdf,.epub" onChange={e => setEbookFile(e.target.files[0])} style={inputStyle} />

                <button type="submit" style={btnStyle}>
                    {editId ? 'Cập nhật sách' : 'Thêm sách mới'}
                </button>
                {editId && (
                    <button type="button" onClick={() => { setEditId(null); setForm({}); }} style={{ ...btnStyle, backgroundColor: '#6c757d' }}>
                        Hủy sửa
                    </button>
                )}
            </form>

            <h3>Danh sách sách hiện có ({books.length})</h3>
            {loading ? <p>Đang tải...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={thStyle}>Ảnh</th>
                            <th style={thStyle}>Tên sách</th>
                            <th style={thStyle}>Tác giả</th>
                            <th style={thStyle}>Danh mục</th>
                            <th style={thStyle}>Năm XB</th>
                            <th style={thStyle}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book._id}>
                                <td>
                                    <img 
                                        src={book.coverImage ? `${BASE_URL}${book.coverImage}` : "https://via.placeholder.com/80"} 
                                        alt="" 
                                        width="60" 
                                    />
                                </td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.category?.name || '—'}</td>
                                <td>{book.publishedYear}</td>
                                <td>
                                    <button onClick={() => handleEdit(book)} style={smallBtn}>Sửa</button>
                                    <button onClick={() => handleDelete(book._id)} style={{ ...smallBtn, backgroundColor: '#dc3545' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', padding: '8px', margin: '8px 0', borderRadius: '4px' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' };
const smallBtn = { padding: '4px 10px', marginRight: '5px', cursor: 'pointer' };
const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };

export default BookManagement;