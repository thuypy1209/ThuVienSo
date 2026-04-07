import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../css/Home.css';

const AdminUsers = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isAdmin = userInfo.role === 'Admin';
    const isLibrarian = userInfo.role === 'Thủ thư';

    if (!isAdmin && !isLibrarian) {
        navigate('/home');
        return null;
    }

    const [users, setUsers] = useState([]);
    const [activeBranch, setActiveBranch] = useState(isAdmin ? 'thuthu' : 'docgia');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', fullName: '', role: 'Độc giả'
    });
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        const res = await api.get('/users');
        setUsers(res.data.data || []);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ username: '', password: '', email: '', fullName: '', role: 'Độc giả' });
        setShowModal(true);
    };

    const openEdit = (user) => {
        setEditing(user);
        setFormData({
            username: user.username,
            password: '',
            email: user.email,
            fullName: user.fullName,
            role: user.role
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = { ...formData };
            if (editing && !payload.password) delete payload.password; // không đổi pass thì bỏ qua

            if (editing) {
                await api.put(`/users/${editing._id}`, payload);
                alert("✅ Cập nhật thành công!");
            } else {
                await api.post('/users', payload);
                alert("🎉 Tạo người dùng thành công!");
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "❌ Lỗi!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa người dùng này?")) return;
        await api.delete(`/users/${id}`);
        alert("🗑️ Đã xóa!");
        fetchUsers();
    };

    const filteredUsers = users.filter(u => {
        if (activeBranch === 'thuthu') return u.role === 'Thủ thư';
        return u.role === 'Độc giả';
    });

    const roleOptions = isAdmin 
        ? ['Admin', 'Thủ thư', 'Độc giả'] 
        : ['Độc giả'];

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            {/* NAV */}
            <nav style={navStyle}>
                <div style={logoStyle} onClick={() => navigate('/home')}>📚 HUTECH Admin</div>
                <button onClick={() => navigate('/home')} style={backBtnStyle}>Quay lại</button>
            </nav>

            <div style={containerStyle}>
                <h2 style={titleStyle}>👥 Quản lý Người Dùng</h2>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {isAdmin && (
                        <span
                            style={activeBranch === 'thuthu' ? activeTabStyle : tabStyle}
                            onClick={() => setActiveBranch('thuthu')}
                        >
                            👮‍♂️ Thủ Thư
                        </span>
                    )}
                    <span
                        style={activeBranch === 'docgia' ? activeTabStyle : tabStyle}
                        onClick={() => setActiveBranch('docgia')}
                    >
                        📖 Độc Giả
                    </span>
                </div>

                {isAdmin && <button onClick={openCreate} style={addBtnStyle}>➕ Thêm người dùng</button>}

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Quyền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u._id}>
                                <td>{u.username}</td>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td><strong>{u.role}</strong></td>
                                <td>{u.isActive ? '✅ Hoạt động' : '❌ Khóa'}</td>
                                <td>
                                    <button style={editBtn} onClick={() => openEdit(u)}>✏️</button>
                                    <button style={deleteBtn} onClick={() => handleDelete(u._id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={overlay}>
                    <div style={modalBox}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {editing ? "✏️ Sửa người dùng" : "➕ Thêm người dùng"}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={inputStyle} />
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                            <input name="fullName" placeholder="Họ tên" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
                            <input name="password" type="password" placeholder={editing ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"} value={formData.password} onChange={handleChange} required={!editing} style={inputStyle} />

                            <label>Quyền</label>
                            <select name="role" value={formData.role} onChange={handleChange} required style={inputStyle} disabled={!isAdmin}>
                                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={saveBtn}>{loading ? "⏳" : "💾 Lưu"}</button>
                                <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>❌ Hủy</button>
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
const containerStyle = { maxWidth: '1100px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const titleStyle = { textAlign: 'center', color: '#1a5f7a', marginBottom: '20px' };
const addBtnStyle = { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '15px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const editBtn = { marginRight: '8px', background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' };
const deleteBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' };
const overlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalBox = { background: 'white', padding: '30px', borderRadius: '12px', width: '460px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' };
const saveBtn = { flex: 1, background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '8px' };
const cancelBtn = { flex: 1, background: '#ccc', border: 'none', padding: '12px', borderRadius: '8px' };

const tabStyle = { padding: '10px 20px', background: '#f0f0f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const activeTabStyle = { ...tabStyle, background: '#1a5f7a', color: 'white' };

export default AdminUsers;