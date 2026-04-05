import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/ReaderPage.css';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const USER_EMAIL = "viet@gmail.com";
const PARAGRAPHS_PER_PAGE = 5; // Ní có thể điều chỉnh số đoạn văn mỗi trang ở đây

const ReaderPage = () => {
  const { id } = useParams();
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(18);
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  
  // 🚀 State mới cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [paragraphs, setParagraphs] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1); // Load xong thì về trang 1
  };


  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Không tìm thấy sách");
        return res.json();
      })
      .then(data => {
        setCurrentBook(data);
        // Chia nội dung thành mảng các đoạn văn
        if (data.content) {
          const splitContent = data.content.split('\n').filter(p => p.trim() !== "");
          setParagraphs(splitContent);
        }

        // Tăng lượt xem khi vừa vào
        fetch(`http://localhost:8080/api/books/${data.id}/view`, { method: 'POST' })
          .catch(err => console.error("Lỗi tăng view:", err));
      })
      .catch(err => {
        console.error(err);
        setCurrentBook(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 🚀 Logic Cập nhật lịch sử đọc mỗi khi đổi trang
  useEffect(() => {
    if (currentBook && paragraphs.length > 0) {
      const totalPages = Math.ceil(paragraphs.length / PARAGRAPHS_PER_PAGE);
      
      fetch('http://localhost:8080/api/reading/capnhat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: USER_EMAIL,
          bookId: currentBook.id,
          currentPage: currentPage,
          totalPages: totalPages
        })
      })
      .then(res => res.text())
      .then(msg => console.log("Lưu tiến trình trang " + currentPage))
      .catch(err => console.error("Lỗi lưu lịch sử:", err));
    }
  }, [currentPage, paragraphs.length, currentBook]);

  // Tính toán nội dung hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * PARAGRAPHS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - PARAGRAPHS_PER_PAGE;
  const currentItems = paragraphs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(paragraphs.length / PARAGRAPHS_PER_PAGE);

  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages || 1));

  return (
    <div className={`reader-container theme-${theme}`}>
      <div className="reader-sidebar">
        <Link to="/books" className="back-btn">⬅ Tủ Sách</Link>
        <div className="toc-title">Mục lục</div>
        <ul className="toc-list">
          {currentBook ? <li className='active'>{currentBook.title}</li> : <li>Đang tải...</li>}
        </ul>
        {/* Hiển thị số trang ở sidebar cho dễ nhìn */}
        <div className="page-info-sidebar">
            Trang: {currentPage} / {totalPages || 1}
        </div>
      </div>

      <div className="reader-main">
        <div className="reader-toolbar">
          <div className="tool-group">
            <span>Cỡ chữ:</span>
            <button className="tool-btn" onClick={() => setFontSize(f => Math.max(12, f - 2))}>A-</button>
            <button className="tool-btn" onClick={() => setFontSize(f => Math.min(32, f + 2))}>A+</button>
          </div>
          <div className="tool-group">
            <span style={{marginLeft: '20px'}}>Màu nền:</span>
            <div className="theme-circles">
              <div className={`circle light ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}></div>
              <div className={`circle sepia ${theme === 'sepia' ? 'active' : ''}`} onClick={() => setTheme('sepia')}></div>
              <div className={`circle dark ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}></div>
            </div>
          </div>
        </div>

        <div className="reader-content-area">
          <div className="book-page" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loading ? (
               <h2 style={{textAlign: 'center', marginTop: '50px'}}>⏳ Đang mở sách...</h2>
            ) : currentBook && currentBook.content ? (
              
              /* KIỂM TRA XEM NẾU LÀ FILE PDF THÌ HIỂN THỊ IFRAME */
              currentBook.content.toLowerCase().endsWith('.pdf') ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  {/* Khung hiển thị trang PDF */}
                  <div style={{ border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Document
                      file={`http://localhost:8080${currentBook.content}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={<p>Đang tải dữ liệu PDF...</p>}
                    >
                      {/* Chỉ render cái trang hiện tại thôi cho nhẹ máy */}
                      <Page pageNumber={currentPage} width={800} renderAnnotationLayer={false} /> 
                    </Document>
                  </div>
                <div className="page-navigation" style={{ marginTop: '20px' }}>
                    <button className="nav-btn" onClick={goToPrevPage} disabled={currentPage === 1}>
                      ⬅ Trang trước
                    </button>
                    <span className="page-indicator" style={{ margin: '0 20px' }}>
                      Trang {currentPage} / {numPages || '--'}
                    </span>
                    <button className="nav-btn" onClick={goToNextPage} disabled={currentPage === numPages}>
                      Trang sau ➡
                    </button>
                  </div>

                </div>): (
                /* NẾU LÀ SÁCH TEXT (.txt) THÌ VẪN HIỂN THỊ CHỮ NHƯ CŨ */
                <div>
                    <h2 className="book-chapter-title" style={{ fontSize: `${fontSize + 8}px` }}>
                      {currentBook.title}
                    </h2>
                    
                    {currentItems && currentItems.map((paragraph, idx) => (
                      <p key={idx} className="book-text" style={{ fontSize: `${fontSize}px` }}>
                        {paragraph}
                      </p>
                    ))}

                    <div className="page-navigation">
                      <button className="nav-btn" onClick={goToPrevPage} disabled={currentPage === 1}>Trang trước</button>
                      <span className="page-indicator">Trang {currentPage} / {totalPages}</span>
                      <button className="nav-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>Trang sau</button>
                    </div>
                </div>
              )

            ) : (
              <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h2>📭 Nội dung trống</h2>
                <p>Ní vui lòng kiểm tra lại nội dung sách trong Admin.</p>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
  );
};

export default ReaderPage;