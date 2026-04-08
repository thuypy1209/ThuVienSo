// src/pages/BookPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/BookPage.css'; 
import '../css/HomePage.css'; 
import bannerImg from '../assets/library-bg.jpg';
import axiosClient from '../api/axiosClient'; // ✅ Dùng hàng hiệu axiosClient

const BookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);

  // Lấy thông tin user từ localStorage để biết ai đang xem
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isUserVip = localStorage.getItem('isUserVip') === 'true';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  // --- 1. LOAD DỮ LIỆU TỪ BACKEND MỚI ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách sách
        const booksRes = await axiosClient.get('/books');
        setBooks(booksRes.data || booksRes || []);

        if (user._id) {
          // Lấy danh sách yêu thích của riêng user này
          const favsRes = await axiosClient.get(`/wishlists/user/${user._id}`);
          setFavorites(favsRes.data || favsRes || []);

          // Lấy lịch sử mượn/đọc (Nếu đã làm bảng borrowRecords)
          const historyRes = await axiosClient.get(`/borrowRecords`);
          // Lọc ra các bản ghi của user này
          const myHistory = (historyRes.data || historyRes || []).filter(r => r.user?._id === user._id);
          setRecentBooks(myHistory);
        }
      } catch (error) {
        console.error("Lỗi kết nối hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user._id]);

  // --- 2. XỬ LÝ YÊU THÍCH (WISHList) ---
  const handleToggleFavorite = async (bookId) => {
    if (!user._id) return alert("Ní phải đăng nhập mới thả tim được!");

    try {
      // Kiểm tra xem đã thích chưa
      const existingFav = favorites.find(f => f.book?._id === bookId);

      if (existingFav) {
        // Nếu thích rồi -> Xóa (Dùng API Delete của wishlists)
        await axiosClient.delete(`/wishlists/${existingFav._id}`);
      } else {
        // Nếu chưa -> Thêm (Dùng API Create của wishlists)
        await axiosClient.post('/wishlists', { user: user._id, book: bookId });
      }

      // Load lại danh sách tim cho mới nhất
      const favsRes = await axiosClient.get(`/wishlists/user/${user._id}`);
      setFavorites(favsRes.data || favsRes || []);
    } catch (err) {
      alert(err.message || "Lỗi thao tác yêu thích!");
    }
  };

  // --- 3. ĐÁNH GIÁ SAO (REVIEWS) ---
  const handleRateBook = async (e, bookId, star) => {
    e.stopPropagation();
    if (!user._id) return alert("Đăng nhập để đánh giá nhé ní!");

    try {
      await axiosClient.post('/reviews', {
        book: bookId,
        user: user._id,
        rating: star,
        comment: "Đánh giá nhanh từ Tủ sách"
      });
      alert(`Ní đã tặng ${star} sao cho cuốn sách này!`);
      // Reload sách để cập nhật rating trung bình (nếu backend có tính toán)
      const booksRes = await axiosClient.get('/books');
      setBooks(booksRes.data || booksRes || []);
    } catch (err) {
      alert("Ní đã đánh giá sách này rồi hoặc có lỗi xảy ra!");
    }
  };

  const renderInteractiveStars = (book) => {
    const currentRating = book.rating || 5; // Mặc định 5 sao cho đẹp nếu chưa có data
    return (
      <div className="interactive-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star}
            className={`star-icon ${star <= Math.round(currentRating) ? 'filled' : 'empty'}`}
            onClick={(e) => handleRateBook(e, book._id, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Thuật toán lọc
  const filteredBooks = books.filter(book => {
    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory ? book.categoryId === filterCategory : true;
    return matchSearch && matchCat;
  });

  return (
    <div className="book-page-container">
      <header className="home-header">
        <div className="header-logo">🎓 HUTECH DIGILIB</div>
        <nav className="header-nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/books" className="active">Tủ sách</Link>
          <Link to="/forum">Diễn đàn</Link>
          <Link to="/favorites">Sách yêu thích</Link>
          <Link to="/history">Lịch sử đọc</Link>
        </nav>
      </header>

      <section 
        className="book-banner"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', padding: '50px 20px' }}
      >
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm kiếm ấn phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn-icon">🔍</button>
        </div>
      </section>

      <section className="books-content">
        <div className="content-header">
          <h2>Ấn phẩm mới nhất</h2>
        </div>

        {loading ? (
          <h3 style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang lục lọi tủ sách...</h3>
        ) : filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => {
              const isFav = favorites.some(f => f.book?._id === (book._id || book.id));

              return (
                <div className="book-card-item" key={book._id || book.id}>
                  <button onClick={() => handleToggleFavorite(book._id || book.id)} className="heart-btn">
                    {isFav ? '💜' : '🤍'}
                  </button>

                  <img src={book.imageLink || 'https://placehold.co/150x200'} alt={book.title} className="book-cover-large" />
                  
                  <div className="book-details">
                    <h3 title={book.title}>{book.title}</h3>
                    <p>{book.author || 'Tác giả ẩn danh'}</p>
                    <div className="book-stats">
                      {renderInteractiveStars(book)}
                    </div>
                    
                    {book.isCopyrighted && !isUserVip ? (
                      <button className="btn-read" style={{ background: '#f39c12' }} onClick={() => navigate('/vip')}>
                        👑 VIP
                      </button>
                    ) : (
                      <button className="btn-read" onClick={() => navigate(`/read/${book._id || book.id}`)}>
                        📖 Đọc Ngay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-container" style={{ textAlign: 'center', padding: '60px' }}>
             <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Not Found" style={{ width: '100px' }} />
             <h3>Không tìm thấy cuốn nào cả ní ơi!</h3>
             <button onClick={() => setSearchTerm('')}>Quay lại tủ sách</button>
          </div>
        )}
      </section>

      <footer className="site-footer">
         <div className="footer-content">
            <p>© 2026 HUTECH DIGILIB - Code by MinhAn</p>
            <p>Liên hệ: {user.email || 'minhandeptrainhat@gmail.com'}</p>
         </div>
      </footer>
    </div>
  );
};

export default BookPage;