import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home'; // ĐÂY LÀ HÀNG THẬT
import ReadBook from './pages/ReadBook';
import Forum from './pages/Forum';
import BookManagement from './pages/BookManagement';
import AuthorsList from './pages/AuthorsList';
import AuthorDetail from './pages/AuthorDetail';
import PublishersList from './pages/PublishersList';
import BorrowHistory from './pages/BorrowHistory';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';
import Bookshelf from './pages/Bookshelf';

// TUYỆT ĐỐI XÓA DÒNG: const Home = () => ... (NẾU CÒN)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cổng vào mặc định: Đăng nhập/Đăng ký */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Trang chủ sau khi đăng nhập thành công */}
        <Route path="/home" element={<Home />} />
        
        {/* Trang đọc sách bảo mật */}
        <Route path="/doc-sach/:id" element={<ReadBook />} />
        {/* Trang diễn đàn thảo luận */}
        <Route path="/quan-ly-sach" element={<BookManagement />} />
        <Route path="/forum" element={<Forum />} />

        {/* Các trang bổ sung */}
        <Route path="/authors-list" element={<AuthorsList />} />
        <Route path="/author/:id" element={<AuthorDetail />} />
        <Route path="/publishers" element={<PublishersList />} />
        <Route path="/borrow-history" element={<BorrowHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;