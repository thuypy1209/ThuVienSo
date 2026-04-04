import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home'; // ĐÂY LÀ HÀNG THẬT
import ReadBook from './pages/ReadBook';
import Forum from './pages/Forum';

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
        <Route path="/doc-sach" element={<ReadBook />} />
        {/* Trang diễn đàn thảo luận */}
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;