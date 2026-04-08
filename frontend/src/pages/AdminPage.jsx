import React, { useState, useEffect } from 'react';
import '../css/AdminPage.css';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('BOOKS'); 
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [books, setBooks] = useState([]);
  const [news, setNews] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  const navigate = useNavigate();
  

  const [newBook, setNewBook] = useState({
    title: '', author: '', publishYear: '', categoryId: '', description: '', isCopyrighted: false
  });

  const [newArticle, setNewArticle] = useState({ title: '', content: '' });

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    try {
      const booksRes = await axiosClient.get('/books');
      // AxiosClient của bạn đã có interceptor trả về .data nên ta lấy trực tiếp
      setBooks(booksRes.data || booksRes || []);

      const newsRes = await axiosClient.get('/posts');
      setNews(newsRes.data || newsRes || []);
    } catch (err) {
      console.error("Lỗi load dữ liệu:", err);
    }
  };

  // ==========================================
  // XỬ LÝ XÓA (Sử dụng _id của MongoDB)
  // ==========================================
  const handleDeleteBook = async (id) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa cuốn sách này?")) return;
    try {
      await axiosClient.delete(`/books/${id}`);
      alert("Đã xóa sách thành công!");
      refreshData();
    } catch (error) { alert("❌ Lỗi khi xóa: " + error.message); }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa bản tin này?")) return;
    try {
      await axiosClient.delete(`/posts/${id}`);
      alert("Đã xóa tin thành công!");
      refreshData();
    } catch (error) { alert("❌ Lỗi khi xóa!"); }
  };

  // ==========================================
  // THÊM SÁCH PDF (Kết hợp Upload file và Lưu DB)
  // ==========================================
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title) return alert("Vui lòng nhập tên sách");
    if (!pdfFile) return alert("Bạn chưa chọn file PDF!");

    setLoading(true);
    try {
      // BƯỚC 1: UPLOAD FILE PDF LÊN SERVER
      const formDataPdf = new FormData();
      formDataPdf.append('file', pdfFile);
      const uploadRes = await axiosClient.post('/upload', formDataPdf, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = uploadRes.fileUrl; // Đường dẫn file từ server trả về

      // BƯỚC 2: LƯU THÔNG TIN SÁCH VÀO DATABASE
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        publishYear: newBook.publishYear,
        // Giả sử bạn up ảnh bìa bằng link hoặc upload tương tự PDF
        imageLink: imageFile ? URL.createObjectURL(imageFile) : 'https://placehold.co/150x200',
        isDeleted: false
      };

      const savedBook = await axiosClient.post('/books', bookData);

      // BƯỚC 3: TẠO BẢN GHI TRONG EBOOKFILES (Liên kết Sách và File PDF)
      await axiosClient.post('/ebookFiles', {
        book: savedBook._id || savedBook.id,
        fileUrl: fileUrl,
        format: 'PDF'
      });

      alert("🎉 Đã lưu sách và upload PDF thành công!");
      refreshData();
      setShowBookModal(false);
      resetBookForm();
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + error.message);
    }
    setLoading(false);
  };

  const resetBookForm = () => {
    setNewBook({ title: '', author: '', publishYear: '', categoryId: '', description: '', isCopyrighted: false });
    setPdfFile(null);
    setImageFile(null);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">HUTECH ADMIN</div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'BOOKS' ? 'active' : ''} onClick={() => setActiveTab('BOOKS')}>Quản lý Tủ Sách</li>
          <li className={activeTab === 'NEWS' ? 'active' : ''} onClick={() => setActiveTab('NEWS')}>Quản lý Tin Tức</li>
        </ul>
      </aside>

      <main className="admin-main">
        {activeTab === 'BOOKS' && (
          <>
            <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <button className="btn-back"onClick={() => navigate('/')}>← Về Home</button>
            <h2>Quản lý Tủ Sách</h2></header>
            
            <section className="admin-card">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3>Danh mục sách ({books.length})</h3>
                <button className="btn-add" onClick={() => setShowBookModal(true)}>+ Thêm sách PDF</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Bìa</th><th>Tên Sách</th><th>Tác giả</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id || book.id}>
                      <td><img src={book.imageLink || 'https://placehold.co/50x70'} style={{width: '50px', height: '70px', objectFit: 'cover'}} alt="bia" /></td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author || 'Chưa rõ'}</td>
                      <td>
                        <button className="btn-delete" onClick={() => handleDeleteBook(book._id || book.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* Modal Thêm Sách */}
        {showBookModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal" style={{ width: '650px' }}>
              <h2>THÊM SÁCH PDF MỚI</h2>
              <form onSubmit={handleAddBook}>
                <div className="form-group">
                  <label>Tên sách (*)</label>
                  <input type="text" required value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Tác giả</label>
                  <input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginTop: '15px', padding: '15px', background: '#fff5f5', borderRadius: '8px', border: '1px dashed #e74c3c' }}>
                  <label style={{ color: '#c0392b', fontWeight: 'bold' }}> Chọn File PDF (*)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
                </div>
                <div className="modal-actions" style={{marginTop: '20px'}}>
                  <button type="button" onClick={() => setShowBookModal(false)}>Hủy</button>
                  <button type="submit" className="btn-add" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Lưu Sách"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;