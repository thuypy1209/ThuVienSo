import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const AdminCategories = () => {
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo?.role === 'Admin';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // ================= LOAD =================
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ================= HANDLE =================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setFormData({
            name: cat.name,
            description: cat.description
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editing) {
                await api.put(`/categories/${editing._id}`, formData);
                alert("✅ Cập nhật thành công!");
            } else {
                await api.post('/categories', formData);
                alert("🎉 Thêm thành công!");
            }

            setShowModal(false);
            fetchCategories();

        } catch (err) {
            alert(err.response?.data?.message || "Lỗi!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

        try {
            await api.delete(`/categories/${id}`);
            alert("🗑️ Đã xóa!");
            fetchCategories();
        } catch (err) {
            alert("❌ Lỗi xóa!");
        }
    };

    // ================= UI =================
    return (
        <div style={{ background: '#f4f7f6', minHeight: '100vh' }}>

            {/* NAVBAR */}
            <nav style={navStyle}>
                <div style={logoStyle} onClick={() => navigate('/home')}>
                    📚 HUTECH Admin
                </div>

                <button onClick={() => navigate('/tu-sach')} style={backBtnStyle}>
                    Quay lại
                </button>
            </nav>

            {/* MAIN */}
            <div style={containerStyle}>
                <h2 style={titleStyle}>📂 Quản lý danh mục</h2>

                {isAdmin && (
                    <button onClick={openCreate} style={addBtn}>
                        ➕ Thêm danh mục
                    </button>
                )}

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Mô tả</th>
                            {isAdmin && <th>Hành động</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id} style={rowStyle}>
                                <td style={cellStyle}>{cat.name}</td>
                                <td style={cellStyle}>{cat.description}</td>

                                {isAdmin && (
                                    <td style={cellStyle}>
                                        <button style={editBtn} onClick={() => openEdit(cat)}>✏️</button>
                                        <button style={deleteBtn} onClick={() => handleDelete(cat._id)}>🗑️</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3 style={{ marginBottom: '15px', color: '#1a5f7a' }}>
                            {editing ? "✏️ Sửa danh mục" : "➕ Thêm danh mục"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tên danh mục"
                                required
                                style={inputStyle}
                            />

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả"
                                style={inputStyle}
                            />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" disabled={loading} style={saveBtn}>
                                    {loading ? "⏳..." : "💾 Lưu"}
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

// ================= STYLE =================
const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
};

const logoStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a5f7a',
    cursor: 'pointer'
};

const backBtnStyle = {
    padding: '8px 15px',
    borderRadius: '6px',
    border: 'none',
    background: '#ecf0f1',
    cursor: 'pointer'
};

const containerStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
};

const titleStyle = {
    textAlign: 'center',
    color: '#1a5f7a',
    marginBottom: '20px'
};

const addBtn = {
    marginBottom: '15px',
    padding: '10px 15px',
    borderRadius: '8px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const rowStyle = {
    borderBottom: '1px solid #eee'
};

const cellStyle = {
    padding: '12px'
};

const editBtn = {
    marginRight: '10px',
    padding: '6px 10px',
    border: 'none',
    background: '#3498db',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
};

const deleteBtn = {
    padding: '6px 10px',
    border: 'none',
    background: '#e74c3c',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
};

const modalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const modalBox = {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    width: '350px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
};

const saveBtn = {
    flex: 1,
    padding: '10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const cancelBtn = {
    flex: 1,
    padding: '10px',
    background: '#bdc3c7',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

export default AdminCategories;