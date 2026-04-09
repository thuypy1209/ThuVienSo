import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [hasPurchase, setHasPurchase] = useState(false);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1.5);
    const [theme, setTheme] = useState('light');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [textContents, setTextContents] = useState({});
    const [notes, setNotes] = useState({});
    const [bookmarks, setBookmarks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [continuousMode, setContinuousMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // === TTS VOICE SELECTION ===
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const canvasRef = useRef(null);
    const continuousContainerRef = useRef(null);
    const renderTaskRef = useRef(null);
    const bookKey = `book_${id}`;

    // Giới hạn xem thử
    const PREVIEW_LIMIT = 3;

    // Load danh sách giọng nói
    useEffect(() => {
        const loadVoices = () => {
            const available = speechSynthesis.getVoices();
            setVoices(available);
            const viVoices = available.filter(v =>
                v.lang === 'vi-VN' || v.lang === 'vi' ||
                v.name.toLowerCase().includes('viet') ||
                v.name.toLowerCase().includes('viết') ||
                v.name.toLowerCase().includes('vietnam')
            );
            if (viVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(viVoices[0]);
            }
        };
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    // ==================== LOAD SÁCH ====================
    useEffect(() => {
        const initBook = async () => {
            try {
                const [bookRes, ownershipRes] = await Promise.all([
                    api.get(`/books/${id}`),
                    api.get(`/books/${id}/ownership`)
                ]);
                const bookData = bookRes.data.data;
                setBook(bookData);
                setHasPurchase(ownershipRes.data.hasPurchase);

                if (bookData.fileUrl) {
                    const url = bookData.fileUrl.startsWith('http')
                        ? bookData.fileUrl
                        : `http://localhost:3000${bookData.fileUrl}`;

                    const loadingTask = pdfjsLib.getDocument(url);
                    const pdf = await loadingTask.promise;
                    setPdfDoc(pdf);
                    setTotalPages(pdf.numPages);

                    const saved = JSON.parse(localStorage.getItem(bookKey) || '{}');
                    if (saved.currentPage) {
                        const savedPage = parseInt(saved.currentPage);
                        // Giới hạn trang cho bản xem thử
                        setCurrentPage(hasPurchase ? savedPage : Math.min(savedPage, PREVIEW_LIMIT));
                    }
                    if (saved.notes) setNotes(saved.notes);
                    if (saved.bookmarks) setBookmarks(saved.bookmarks);
                }
            } catch (err) {
                console.error("Lỗi load sách:", err);
            } finally {
                setLoading(false);
            }
        };
        initBook();
    }, [id]);

    // ==================== GET MAX ALLOWED PAGE ====================
    const getMaxAllowedPage = () => {
        return hasPurchase ? totalPages : Math.min(PREVIEW_LIMIT, totalPages);
    };

    // ==================== RENDER SINGLE PAGE ====================
    const renderSinglePage = async () => {
        if (!pdfDoc || !canvasRef.current || continuousMode) return;

        // Kiểm tra giới hạn trang cho bản xem thử
        const maxAllowed = getMaxAllowedPage();
        if (currentPage > maxAllowed) {
            setCurrentPage(maxAllowed);
            return;
        }

        if (renderTaskRef.current) {
            try { renderTaskRef.current.cancel(); } catch (e) {}
        }

        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: zoomLevel });
        const canvas = canvasRef.current;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const ctx = canvas.getContext('2d');
        const renderTask = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        const filter = {
            light: 'none',
            dark: 'invert(0.9) hue-rotate(180deg) brightness(0.95)',
            sepia: 'sepia(0.7) contrast(1.1) brightness(1.05)'
        };
        canvas.style.filter = filter[theme];

        if (textContents[currentPage] && searchTerm) {
            drawHighlights(ctx, viewport, currentPage);
        }

        // Watermark cho bản xem thử
        if (!hasPurchase) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = '#ff0000';
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'center';
            ctx.fillText('BẢN XEM THỬ - HUTECH', 0, 0);
            ctx.restore();
        }
    };

    const drawHighlights = (ctx, viewport, pageNum) => {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        const items = textContents[pageNum]?.items || [];
        items.forEach(item => {
            if (item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
                const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
                ctx.fillRect(tx[4], tx[5] - item.height * viewport.scale, item.width * viewport.scale, item.height * viewport.scale);
            }
        });
        ctx.restore();
    };

    useEffect(() => {
        if (pdfDoc && !continuousMode) renderSinglePage();
    }, [pdfDoc, currentPage, zoomLevel, theme, searchTerm, continuousMode, hasPurchase]);

    // ==================== TÌM KIẾM (chỉ trong giới hạn cho phép) ====================
    const performSearch = async () => {
        if (!searchTerm || !pdfDoc) return;

        const maxAllowed = getMaxAllowedPage();
        const results = [];

        for (let i = 1; i <= maxAllowed; i++) {
            if (!textContents[i]) {
                const page = await pdfDoc.getPage(i);
                const tc = await page.getTextContent();
                setTextContents(prev => ({ ...prev, [i]: tc }));
            }
            const items = textContents[i]?.items || [];
            if (items.some(item => item.str.toLowerCase().includes(searchTerm.toLowerCase()))) {
                results.push(i);
            }
        }

        setSearchResults(results);
        if (results.length > 0) {
            setCurrentPage(results[0]);
        }
    };

    // ==================== TEXT-TO-SPEECH (chỉ đọc trong giới hạn) ====================
    const speakCurrentPage = async () => {
        if (!pdfDoc || isSpeaking) return;

        const maxAllowed = getMaxAllowedPage();
        if (currentPage > maxAllowed) {
            alert(`Bản xem thử chỉ cho phép đọc tối đa ${PREVIEW_LIMIT} trang!`);
            return;
        }

        setIsSpeaking(true);
        try {
            const page = await pdfDoc.getPage(currentPage);
            const textContent = await page.getTextContent();
            const fullText = textContent.items.map(item => item.str).join(' ');

            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'vi-VN';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
        } catch (err) {
            console.error("TTS Error:", err);
            setIsSpeaking(false);
        }
    };

    const stopSpeaking = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    // ==================== CONTINUOUS MODE (đã giới hạn 3 trang) ====================
    useEffect(() => {
        if (!pdfDoc || !continuousMode || !continuousContainerRef.current) return;

        continuousContainerRef.current.innerHTML = '';

        const maxPages = getMaxAllowedPage();

        const renderAll = async () => {
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.4 });
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.marginBottom = '40px';
                canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                canvas.style.display = 'block';
                canvas.style.background = '#fff';
                continuousContainerRef.current.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                // Watermark cho bản xem thử
                if (!hasPurchase) {
                    ctx.save();
                    ctx.globalAlpha = 0.12;
                    ctx.font = 'bold 42px Arial';
                    ctx.fillStyle = '#ff0000';
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(-Math.PI / 4);
                    ctx.textAlign = 'center';
                    ctx.fillText('BẢN XEM THỬ - HUTECH', 0, 0);
                    ctx.restore();
                }
            }
        };

        renderAll();
    }, [pdfDoc, continuousMode, hasPurchase, totalPages]);

    // ==================== AUTO SAVE ====================
    useEffect(() => {
        localStorage.setItem(bookKey, JSON.stringify({ 
            currentPage: Math.min(currentPage, getMaxAllowedPage()), 
            notes, 
            bookmarks 
        }));
    }, [currentPage, notes, bookmarks, hasPurchase, totalPages]);

    // ==================== NAVIGATION HELPERS ====================
    const goToPrevPage = () => {
        setCurrentPage(p => Math.max(1, p - 1));
    };

    const goToNextPage = () => {
        const maxAllowed = getMaxAllowedPage();
        setCurrentPage(p => Math.min(maxAllowed, p + 1));
    };

    const handlePageInputChange = (e) => {
        let newPage = parseInt(e.target.value) || 1;
        const maxAllowed = getMaxAllowedPage();
        newPage = Math.max(1, Math.min(maxAllowed, newPage));
        setCurrentPage(newPage);
    };

    if (loading) return <div style={styles.loading}>Đang mở sách...</div>;

    const maxAllowedPage = getMaxAllowedPage();
    const progress = maxAllowedPage ? Math.round((currentPage / maxAllowedPage) * 100) : 0;

    return (
        <div style={styles.viewerWrapper}>
            {/* HEADER */}
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuBtn}>☰</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={styles.title}>{book?.title}</span>
                    <span style={{ ...styles.badge, backgroundColor: hasPurchase ? '#27ae60' : '#e67e22' }}>
                        {hasPurchase ? 'FULL' : 'XEM THỬ'}
                    </span>
                </div>

                {/* Zoom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" min="0.5" max="2" step="0.1" value={zoomLevel}
                           onChange={e => setZoomLevel(parseFloat(e.target.value))} style={styles.zoomSlider} />
                    <span style={{ fontSize: '14px', color: '#ddd', minWidth: '45px' }}>
                        {Math.round(zoomLevel * 100)}%
                    </span>
                </div>

                {/* Theme */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => setTheme('light')} style={{ ...styles.themeBtn, background: theme === 'light' ? '#fff' : '#444' }}>☀️</button>
                    <button onClick={() => setTheme('sepia')} style={{ ...styles.themeBtn, background: theme === 'sepia' ? '#f4e8c1' : '#444' }}>📜</button>
                    <button onClick={() => setTheme('dark')} style={{ ...styles.themeBtn, background: theme === 'dark' ? '#222' : '#444' }}>🌙</button>
                </div>

                {/* TTS */}
                <button onClick={isSpeaking ? stopSpeaking : speakCurrentPage} style={styles.ttsBtn}>
                    {isSpeaking ? '⏹️ Dừng' : '🔊 Đọc trang này'}
                </button>

                <button
                    onClick={() => setContinuousMode(!continuousMode)}
                    style={{ ...styles.modeBtn, backgroundColor: continuousMode ? '#27ae60' : '#444' }}
                >
                    {continuousMode ? '📄 Single' : '📜 Continuous'}
                </button>

                <button onClick={() => document.documentElement.requestFullscreen()} style={styles.btn}>⛶</button>
            </div>

            {/* PROGRESS */}
            <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                <span style={styles.progressText}>
                    {currentPage} / {maxAllowedPage} — {progress}%
                    {!hasPurchase && <span style={{ color: '#e67e22', marginLeft: '8px' }}>(Chỉ 3 trang)</span>}
                </span>
            </div>

            <div style={styles.mainContent}>
                {!continuousMode && (
                    <div style={styles.canvasContainer}>
                        <canvas ref={canvasRef} style={styles.canvas} />
                    </div>
                )}

                {continuousMode && (
                    <div style={styles.continuousContainer} ref={continuousContainerRef} />
                )}

                {sidebarOpen && (
                    <div style={styles.sidebar}>
                        <div style={styles.sidebarHeader}>
                            <h3>📝 Ghi chú & Đánh dấu</h3>
                            <button onClick={() => setSidebarOpen(false)} style={styles.closeBtn}>✕</button>
                        </div>

                        <button onClick={() => {
                            const text = prompt(`Ghi chú cho trang ${currentPage}:`);
                            if (text) {
                                setNotes(prev => ({
                                    ...prev,
                                    [currentPage]: [...(prev[currentPage] || []), { id: Date.now(), text, time: new Date().toLocaleString('vi-VN') }]
                                }));
                            }
                        }} style={styles.addNoteBtn}>
                            + Thêm ghi chú trang {currentPage}
                        </button>

                        {(notes[currentPage] || []).map(note => (
                            <div key={note.id} style={styles.noteItem}>
                                <small>{note.time}</small>
                                <p>{note.text}</p>
                                <button 
                                    onClick={() => setNotes(prev => ({ 
                                        ...prev, 
                                        [currentPage]: prev[currentPage].filter(n => n.id !== note.id) 
                                    }))} 
                                    style={styles.deleteNote}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <button onClick={() => {
                            setBookmarks(prev => 
                                prev.includes(currentPage) 
                                    ? prev.filter(p => p !== currentPage) 
                                    : [...prev, currentPage]
                            );
                        }} style={styles.bookmarkBtn}>
                            {bookmarks.includes(currentPage) ? '⭐ Bỏ đánh dấu' : '⭐ Đánh dấu trang này'}
                        </button>

                        {searchResults.length > 0 && (
                            <div style={{ marginTop: '25px' }}>
                                <b style={{ color: '#f1c40f' }}>Kết quả tìm kiếm ({searchResults.length})</b>
                                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '8px' }}>
                                    {searchResults.map(p => (
                                        <div key={p} onClick={() => setCurrentPage(p)} style={styles.searchResult}>
                                            Trang {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!continuousMode && (
                <div style={styles.bottomBar}>
                    <button onClick={goToPrevPage} style={styles.navBtn}>◀ Trước</button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                            type="number" 
                            value={currentPage}
                            onChange={handlePageInputChange}
                            style={styles.pageInput} 
                        />
                        <span style={{ color: '#aaa' }}>/ {maxAllowedPage}</span>
                    </div>

                    <button onClick={goToNextPage} style={styles.navBtn}>Sau ▶</button>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <input 
                            placeholder="Tìm trong sách..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && performSearch()}
                            style={styles.searchInput} 
                        />
                        <button onClick={performSearch} style={styles.searchBtn}>🔎</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==================== STYLES ====================
const styles = {
    viewerWrapper: { height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', overflow: 'hidden' },
    header: { height: '65px', background: '#111', display: 'flex', alignItems: 'center', padding: '0 15px', gap: '12px', zIndex: 10 },
    backBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '26px', cursor: 'pointer' },
    menuBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer' },
    title: { fontSize: '19px', fontWeight: 'bold', color: '#fff', flex: 1 },
    badge: { padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
    zoomSlider: { width: '140px' },
    themeBtn: { width: '38px', height: '38px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '20px' },
    ttsBtn: { padding: '8px 18px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' },
    modeBtn: { padding: '8px 16px', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' },
    btn: { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
    progressBar: { height: '6px', background: '#333', position: 'relative' },
    progressFill: { height: '100%', background: '#27ae60', transition: 'width 0.3s' },
    progressText: { position: 'absolute', top: '-20px', right: '20px', fontSize: '13px', background: '#111', padding: '2px 10px', borderRadius: '12px' },
    mainContent: { flex: 1, display: 'flex', overflow: 'hidden' },
    canvasContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f1e3', overflow: 'auto', padding: '20px' },
    canvas: { boxShadow: '0 15px 40px rgba(0,0,0,0.5)', maxHeight: '100%', maxWidth: '100%' },
    continuousContainer: { flex: 1, overflowY: 'auto', padding: '30px', background: '#f8f1e3', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    sidebar: { width: '360px', background: '#252525', padding: '20px', overflowY: 'auto', borderLeft: '1px solid #333' },
    sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    closeBtn: { background: 'none', border: 'none', color: '#e74c3c', fontSize: '24px', cursor: 'pointer' },
    addNoteBtn: { width: '100%', padding: '14px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '15px', cursor: 'pointer', fontWeight: 'bold' },
    noteItem: { background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', position: 'relative' },
    deleteNote: { position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '20px', cursor: 'pointer' },
    bookmarkBtn: { width: '100%', padding: '12px', background: '#f39c12', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    searchResult: { padding: '10px 14px', background: '#333', margin: '4px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' },
    bottomBar: { height: '65px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '0 20px' },
    navBtn: { padding: '12px 28px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '17px', cursor: 'pointer' },
    pageInput: { width: '80px', textAlign: 'center', padding: '10px', fontSize: '20px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff' },
    searchInput: { padding: '10px 18px', width: '240px', borderRadius: '30px', border: '1px solid #444', background: '#222', color: '#fff' },
    searchBtn: { padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer' },
    loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', color: '#27ae60', fontSize: '22px' }
};

export default ReadBook;