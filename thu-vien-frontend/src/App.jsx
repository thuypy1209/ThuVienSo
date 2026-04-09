import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ReadBook from './pages/ReadBook';
import Forum from './pages/Forum';
import BorrowHistory from './pages/BorrowHistory';
import AuthorsList from './pages/AuthorsList';
import PublishersList from './pages/PublishersList';
import AuthorDetail from './pages/AuthorDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';
import Bookshelf from './pages/Bookshelf';
import AdminAddBook from './pages/AdminAddBook';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/doc-sach/:id" element={<ReadBook />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/borrow-history" element={<BorrowHistory />} />
        
        <Route path="/authors-list" element={<AuthorsList />} /> 
        <Route path="/author/:id" element={<AuthorDetail />} />
        <Route path="/publishers" element={<PublishersList />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/tu-sach" element={<Bookshelf />} />
        <Route path="/admin/add-book" element={<AdminAddBook />} />
        <Route path="/categories" element={<AdminCategories />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;