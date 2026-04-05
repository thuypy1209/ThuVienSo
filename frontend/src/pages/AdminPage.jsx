// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import '../css/AdminPage.css';

const AdminPage = () => {
  // 1. CÁC TRẠNG THÁI (STATE)
  const [activeTab, setActiveTab] = useState('BOOKS'); 
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [books, setBooks] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '', author: '', publishYear: '', category: '', status: 'AVAILABLE', is_copyrighted: false, content: ''
  });

  const [news, setNews] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });

  const [pdfFile, setPdfFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
  };

  const handleContentFileChange = (e) => {
    const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    // Khi đọc xong, nó tự "ném" chữ vào cái ô đen cho ní
    setNewBook(prev => ({ ...prev, content: text })); 
  };
  reader.readAsText(file, "UTF-8");
  setContentFile(file);
  };
  // 2. TỰ ĐỘNG LOAD DỮ LIỆU KHI VÀO TRANG
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetch('http://localhost:8080/api/books/danhsach')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.log("Lỗi load sách:", err));
      
    fetch('http://localhost:8080/api/news/danhsach')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.log("Lỗi load tin tức:", err));
  };

  // ==========================================
  // 3. CÁC HÀM XỬ LÝ XÓA DỮ LIỆU
  // ==========================================
  const handleDeleteBook = async (id) => {
    if (!window.confirm("⚠️ Ní có chắc muốn xóa cuốn sách này không? Dữ liệu sẽ bay màu vĩnh viễn đó!")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/books/xoa/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(books.filter(book => book.id !== id));
      } else {
        alert("❌ Lỗi khi xóa sách!");
      }
    } catch (error) { alert("❌ Lỗi kết nối API!"); }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("⚠️ Ní có chắc muốn xóa bản tin này không?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/news/xoa/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNews(news.filter(item => item.id !== id));
      } else {
        alert("❌ Lỗi khi xóa bản tin!");
      }
    } catch (error) { alert("❌ Lỗi kết nối API!"); }
  };

  // ==========================================
  // 4. CÁC HÀM QUẢN LÝ KHÁC
  // ==========================================
  const handleToggleSuggest = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/books/${bookId}/toggle-suggest`, { method: 'POST' });
      if (res.ok) refreshData();
    } catch (error) { alert("Lỗi cập nhật Gợi ý!"); }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title) return alert("Vui lòng nhập tên sách");
    if (!pdfFile) return alert("Ní chưa chọn file PDF kìa!");

    setLoading(true);
    try {
      const formData = new FormData();
      
      // 1. Đẩy file Ảnh bìa và file PDF vào gói hàng
      if (imageFile) formData.append('image', imageFile);
      formData.append('pdf', pdfFile);

      // 2. Đẩy thông tin sách (Chuyển object thành Blob JSON để Java hiểu là @RequestPart)
      const bookInfo = {
        ...newBook,
        is_copyrighted: Boolean(newBook.is_copyrighted),
        is_premium: Boolean(newBook.is_copyrighted),
        status: 'AVAILABLE'
      };
      formData.append('bookInfo', new Blob([JSON.stringify(bookInfo)], { type: "application/json" }));

      // 3. Gửi lên API xử lý PDF (Ní nên đổi API bên Java thành /them-pdf nhé)
      const res = await fetch('http://localhost:8080/api/books/them-pdf', {
        method: 'POST',
        body: formData // Không set Content-Type, trình duyệt sẽ tự lo
      });

      if (res.ok) {
        alert("🎉 Đã upload sách PDF thành công rực rỡ!");
        refreshData();
        setShowBookModal(false);
        // Reset form
        setNewBook({ title: '', author: '', publishYear: '', category: '', status: 'AVAILABLE', is_copyrighted: false, content: '' });
        setImageFile(null);
        setPdfFile(null);
      } else {
        alert(" Lỗi khi lưu sách PDF (kiểm tra lại Backend)");
      }
    } catch (error) {
      console.error(error);
      alert(" Lỗi kết nối API!");
    }
    setLoading(false);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newArticle.title) return alert("Vui lòng nhập tiêu đề tin tức");
    setLoading(true);
    try {
      let finalImagePath = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('http://localhost:8080/api/images/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) finalImagePath = await uploadRes.text(); 
      }
      const newsToSave = { 
        title: newArticle.title,
        content: newArticle.content,
        imageLink: finalImagePath ? `http://localhost:8080${finalImagePath}` : null 
      };
      const saveRes = await fetch('http://localhost:8080/api/news/them', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newsToSave)
      });
      if (saveRes.ok) {
        refreshData();
        setShowNewsModal(false);
        setNewArticle({ title: '', content: '' });
        setImageFile(null);
        alert("🎉 Đã đăng tin tức thành công!");
      }
    } catch (error) { alert("❌ Lỗi API!"); }
    setLoading(false);
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR TỐI GIẢN */}
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
            <header className="admin-header"><h2>Quản lý Tủ Sách</h2></header>
            <section className="admin-card">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3>Danh mục sách ({books.length})</h3>
                <button className="btn-add" onClick={() => setShowBookModal(true)}>+ Thêm sách thật</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Bìa</th><th>Tên Sách</th><th>Chính sách</th><th>Gợi ý Home</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td><img src={book.image_link || book.imageLink || 'https://placehold.co/50x70?text=No+Cover'} style={{width: '50px', height: '70px', objectFit: 'cover'}} alt="bia" /></td>
                      <td><strong>{book.title}</strong></td>
                      <td>{(book.is_copyrighted || book.isCopyrighted) ? <span style={{color: '#ffcc00'}}>💎 VIP</span> : 'Miễn phí'}</td>
                      <td>
                        <button onClick={() => handleToggleSuggest(book.id)} style={{ backgroundColor: (book.is_suggested || book.isSuggested) ? '#dc3545' : '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                          {(book.is_suggested || book.isSuggested) ? 'Gỡ Home' : 'Đưa lên Home'}
                        </button>
                      </td>
                      <td>
                        <button className="btn-delete" onClick={() => handleDeleteBook(book.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {activeTab === 'NEWS' && (
          <>
            <header className="admin-header"><h2>Quản lý Tin Tức</h2></header>
            <section className="admin-card">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3>Danh sách bản tin ({news.length})</h3>
                <button className="btn-add" onClick={() => setShowNewsModal(true)}>+ Đăng tin mới</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Ảnh Minh họa</th><th>Tiêu đề bài viết</th><th>Ngày đăng</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {news.map(item => (
                    <tr key={item.id}>
                      <td><img src={item.imageLink || 'https://placehold.co/100x60?text=News'} style={{width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} alt="news" /></td>
                      <td><strong>{item.title}</strong></td>
                      <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="btn-delete" onClick={() => handleDeleteNews(item.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>

      {showBookModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ width: '650px' }}>
            <h2 style={{ textAlign: 'center', color: '#003366' }}> THÊM SÁCH PDF MỚI</h2>
            <form onSubmit={handleAddBook}>
              <div style={{ display: 'flex', gap: '25px' }}>
                {/* CỘT TRÁI: THÔNG TIN CHỮ */}
                <div style={{ flex: 1 }}>
                  <div className="form-group">
                    <label>Tên sách (*)</label>
                    <input type="text" required value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Tác giả</label>
                    <input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Năm xuất bản</label>
                    <input type="number" value={newBook.publishYear} onChange={(e) => setNewBook({ ...newBook, publishYear: e.target.value })} />
                  </div>
                  
                  {/* Ô CHỌN FILE PDF - NHẤN MẠNH */}
                  <div className="form-group" style={{ marginTop: '15px', padding: '15px', background: '#fff5f5', borderRadius: '8px', border: '1px dashed #e74c3c' }}>
                    <label style={{ color: '#c0392b', fontWeight: 'bold' }}> Chọn File PDF (*)</label>
                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} style={{ marginTop: '5px' }} />
                    {pdfFile && <p style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>✔️ Đã chọn: {pdfFile.name}</p>}
                  </div>
                </div>

                {/* CỘT PHẢI: ẢNH BÌA */}
                <div style={{ width: '180px', textAlign: 'center' }}>
                  <label>Ảnh bìa (JPG/PNG)</label>
                  <div className="cover-preview-box" style={{ width: '100%', height: '240px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', overflow: 'hidden' }}>
                    {imageFile ? <img src={URL.createObjectURL(imageFile)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" /> : <span style={{ color: '#999' }}>Chưa có ảnh</span>}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginTop: '10px', width: '100%' }} />
                </div>
              </div>

              {/* OPTIONS DƯỚI CÙNG */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={newBook.is_copyrighted} onChange={(e) => setNewBook({ ...newBook, is_copyrighted: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                  <label style={{ color: '#003366', fontWeight: 'bold' }}> Sách độc quyền (VIP)</label>
                </div>

                <div className="modal-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowBookModal(false)} style={{ padding: '10px 20px' }}>Hủy</button>
                  <button type="submit" className="btn-add" disabled={loading} style={{ background: '#28a745', padding: '10px 25px' }}>
                    {loading ? "Đang upload..." : "Lưu Sách PDF"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM TIN TỨC */}
      {showNewsModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{width: '600px'}}>
            <h2>Thêm Sách Thật (Upload File)</h2>
            <form onSubmit={handleAddBook}>
              <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                  <div className="form-group"><label>Tên sách (*)</label><input type="text" required value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} /></div>
                  <div className="form-group"><label>Tác giả</label><input type="text" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} /></div>
                  <div className="form-group"><label>Năm xuất bản</label><input type="number" value={newBook.publishYear} onChange={(e) => setNewBook({...newBook, publishYear: e.target.value})} /></div>
                </div>
                <div style={{width: '150px', textAlign: 'center'}}>
                  <label>Ảnh bìa</label>
                  <div className="cover-preview-box">
                    {imageFile ? <img src={URL.createObjectURL(imageFile)} style={{width:'100%', height:'100%', objectFit: 'cover'}} alt="preview"/> : '+'}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{marginTop: '10px', width: '100%'}}/>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '15px', padding: '15px', background: '#f0f7ff', borderRadius: '8px', border: '1px dashed #007bff'}}>
                <label style={{fontWeight: 'bold', color: '#007bff'}}>📄 Tải lên nội dung sách (.txt)</label>
                <input 
                  type="file" 
                  accept=".txt" 
                  onChange={handleContentFileChange} 
                  style={{marginTop: '10px', display: 'block'}}
                />
                <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                   * Khuyên dùng file .txt để nội dung hiển thị chuẩn nhất trên Reader.
                </p>
              </div>
              <div className="form-group" style={{marginTop: '15px', padding: '10px', background: '#2c2c2c', borderRadius: '8px', border: '1px dashed #555'}}>
                <label style={{color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>
                  📄 Tải file nội dung (.txt)
                </label>
                <input 
                  type="file" 
                  accept=".txt" 
                  onChange={handleContentFileChange} 
                  style={{color: '#eee'}}
                />
              </div>
              <div className="form-group" style={{marginTop: '15px'}}>
                <label>Xem trước hoặc chỉnh sửa nội dung</label>
                <textarea 
                  name="content" 
                  value={newBook.content} // Liên kết với state để thấy nội dung sau khi upload
                  onChange={(e) => setNewBook({...newBook, content: e.target.value})} 
                  rows="6" 
                  style={{width: '100%', fontFamily: 'monospace'}}
                  placeholder="Nội dung sẽ tự động xuất hiện ở đây sau khi ní chọn file..."
                ></textarea>
              </div>

              <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                <input type="checkbox" checked={newBook.is_copyrighted} onChange={(e) => setNewBook({...newBook, is_copyrighted: e.target.checked})} style={{width: '20px', height: '20px'}}/>
                <label style={{color: '#003366', fontWeight: 'bold'}}>💎 Đây là sách độc quyền (VIP)</label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => { setShowBookModal(false); resetForm(); }}>Hủy</button>
                <button type="submit" className="btn-add" disabled={loading}>{loading ? "Đang lưu..." : "Lưu Sách Thật"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;