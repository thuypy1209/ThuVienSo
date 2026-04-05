// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ReaderPage from './pages/ReaderPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ForumPage from './pages/ForumPage';
import PostDetailPage from './pages/PostDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import NewsDetailPage from './pages/NewsDetailPage';
import VipPage from './pages/VipPage';

// ADMIN
import AdminPage from './pages/AdminPage';

// HIỆU ỨNG HOA RƠI
import './css/GlobalEffects.css';

const App = () => {
  return (
    <BrowserRouter>
      {/* MỞ THẺ DIV TOÀN CỤC */}
      <div className="global-theme-wrapper">
        
        {/* --- KHU VỰC HIỆU ỨNG HOA ANH ĐÀO RƠI (CHẠY TOÀN CỤC) --- */}
        <div className="cherry-blossom-container" style={{pointerEvents: 'none'}}>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
          <div className="petal">🌸</div>
          <div className="petal">•</div>
          <div className="petal">🌸</div>
        </div>
        {/* -------------------------------------------------------- */}

        <Routes>
          {/* Vừa vào web sẽ trỏ tới trang Đăng Nhập */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Các trang chính */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/forum" element={<ForumPage />} />
        
          <Route path="/forum/:id" element={<PostDetailPage />} />
          <Route path="/read/:id" element={<ReaderPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          {/* TRANG VIP */}
          <Route path="/vip" element={<VipPage />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* TRANG ĐỌC TIN TỨC */}
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* LUẬT BẮT LỖI (BẮT BUỘC PHẢI ĐỂ CUỐI CÙNG) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div> {/* 👉 TUI MỚI BỔ SUNG CÁI THẺ ĐÓNG NÀY VÀO NÈ, CHÍNH LÀ NÓ! */}

    </BrowserRouter>
  );
};

export default App;