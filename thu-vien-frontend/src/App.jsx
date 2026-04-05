import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. IMPORT CÁC TRANG CỦA NÍ VÀO ĐÂY
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ReadBook from './pages/ReadBook';
import Forum from './pages/Forum';
import BorrowHistory from './pages/BorrowHistory';
import AuthorsList from './pages/AuthorsList'; // <-- PHẢI CÓ DÒNG NÀY
import PublishersList from './pages/PublishersList';
import AuthorDetail from './pages/AuthorDetail'; // Trang chi tiết tác giả
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';
import Bookshelf from './pages/Bookshelf';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn mặc định */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Các trang chính */}
        <Route path="/home" element={<Home />} />
        <Route path="/doc-sach/:id" element={<ReadBook />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/borrow-history" element={<BorrowHistory />} />
        
        {/* 2. KHAI BÁO VISA CHO TRANG TÁC GIẢ Ở ĐÂY */}
        <Route path="/authors-list" element={<AuthorsList />} /> 
        <Route path="/author/:id" element={<AuthorDetail />} /> {/* Trang chi tiết tác giả */}
        <Route path="/publishers" element={<PublishersList />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
        
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;