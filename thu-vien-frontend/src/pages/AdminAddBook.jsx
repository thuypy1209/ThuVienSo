import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const AdminAddBooks = () => {
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo?.role === 'Admin';

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        description: '',
        publishedYear: ''
    });

    const [coverFile, setCoverFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        const res = await api.get('/books');
        setBooks(res.data.data || []);
    };

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
    };

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({
            title: '',
            author: '',
            category: '',
            description: '',
            publishedYear: ''
        });
        setCoverFile(null);
        setPdfFile(null);
        setShowModal(true);
    };

    const openEdit = (book) => {
        setEditing(book);
        setFormData({
            title: book.title,
            author: book.author,
            category: book.category?._id,
            description: book.description,
            publishedYear: book.publishedYear
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let coverImageUrl = editing?.coverImage || '';
            let pdfFileUrl = editing?.fileUrl || '';

            if (coverFile) {
                const form = new FormData();
                form.append('file', coverFile);
                const res = await api.post('/upload', form);
                coverImageUrl = res.data.data.fileUrl;
            }

            if (pdfFile) {
                const form = new FormData();
                form.append('file', pdfFile);
                const res = await api.post('/upload', form);
                pdfFileUrl = res.data.data.fileUrl;
            }

            const payload = {
                ...formData,
                coverImage: coverImageUrl,
                fileUrl: pdfFileUrl
            };

            if (editing) {
                await api.put(`/books/${editing._id}`, payload);
                alert("✅ Cập nhật thành công!");
            } else {
                await api.post('/books', payload);
                alert("🎉 Thêm sách thành công!");
            }

            setShowModal(false);
            fetchBooks();

        } catch (err) {
            alert(err.response?.data?.message || "❌ Lỗi!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

        await api.delete(`/books/${id}`);
        alert("🗑️ Đã xóa!");
        fetchBooks();
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>

            {/* NAV */}
            <nav style={navStyle}>
                <div style={logoStyle} onClick={() => navigate('/home')}>
                    📚 HUTECH Admin
                </div>

                <button onClick={() => navigate('/tu-sach')} style={backBtnStyle}>
                    Quay lại
                </button>
            </nav>

            {/* CONTENT */}
            <div style={containerStyle}>
                <h2 style={titleStyle}>📚 Quản lý sách</h2>

                {isAdmin && (
                    <button onClick={openCreate} style={addBtnStyle}>
                        ➕ Thêm sách
                    </button>
                )}

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên</th>
                            <th>Tác giả</th>
                            <th>Thể loại</th>
                            {isAdmin && <th>Hành động</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {books.map(b => (
                            <tr key={b._id}>
                                <td>
                                    <img
                                        src={
                                            b.coverImage
                                                ? `http://localhost:3000${b.coverImage}`
                                                : 'https://via.placeholder.com/60'
                                        }
                                        width="50"
                                        style={{ borderRadius: '6px' }}
                                    />
                                </td>
                                <td>{b.title}</td>
                                <td>{b.author}</td>
                                <td>{b.category?.name}</td>

                                {isAdmin && (
                                    <td>
                                        <button style={editBtn} onClick={() => openEdit(b)}>✏️</button>
                                        <button style={deleteBtn} onClick={() => handleDelete(b._id)}>🗑️</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={overlay}>
                    <div style={modalBox}>
                        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
                            {editing ? "✏️ Sửa sách" : "➕ Thêm sách"}
                        </h3>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                            <input name="title" placeholder="Tên sách" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input name="author" placeholder="Tác giả" value={formData.author} onChange={handleChange} required style={inputStyle} />

                            <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                                <option value="">-- Chọn thể loại --</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <input name="publishedYear" placeholder="Năm XB" value={formData.publishedYear} onChange={handleChange} style={inputStyle} />
                            <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} style={inputStyle} />

                            <div style={uploadBox}>
                                <label>🖼️ Ảnh bìa</label>
                                <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />

                                <label>📄 File PDF</label>
                                <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={saveBtn}>
                                    {loading ? "⏳" : "💾 Lưu"}
                                </button>

                                <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>
                                    ❌ Hủy
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' };
const logoStyle = { fontSize: '24px', fontWeight: 'bold', color: '#1a5f7a', cursor: 'pointer' };
const backBtnStyle = { padding: '8px 15px', borderRadius: '5px', background: '#ecf0f1', border: 'none', cursor: 'pointer' };

const containerStyle = { maxWidth: '1000px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const titleStyle = { textAlign: 'center', color: '#1a5f7a', marginBottom: '20px' };

const addBtnStyle = { padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '15px', cursor: 'pointer' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' };

const editBtn = { marginRight: '10px', background: '#3498db', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px' };
const deleteBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px' };

const overlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalBox = { background: 'white', padding: '25px', borderRadius: '12px', width: '420px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' };

const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' };

const uploadBox = { border: '2px dashed #3498db', padding: '10px', borderRadius: '10px', background: '#f8fbff' };

const saveBtn = { flex: 1, background: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' };
const cancelBtn = { flex: 1, background: '#ccc', border: 'none', padding: '10px', borderRadius: '8px' };

export default AdminAddBooks;