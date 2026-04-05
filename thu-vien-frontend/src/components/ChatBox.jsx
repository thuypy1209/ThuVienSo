import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Kết nối tới Backend Node.js
const socket = io('http://localhost:3000');

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Đóng/mở khung chat
    const scrollRef = useRef();

    // Lấy thông tin người dùng từ túi (localStorage)
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        // 1. Lắng nghe tin nhắn mới từ "loa" của Backend
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // 2. Tự động cuộn xuống tin nhắn mới nhất
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });

        return () => socket.off('receive_message');
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() !== '') {
            // Gửi tin nhắn qua sợi dây điện Socket
            socket.emit('send_message', {
                sender: userInfo._id, // ID người gửi thật
                content: input
            });
            setInput('');
        }
    };

    return (
        <div style={containerStyle}>
            {/* Nút bấm tròn để mở Chat */}
            <div onClick={() => setIsOpen(!isOpen)} style={toggleBtnStyle}>
                {isOpen ? '❌' : '💬 Chat Q&A'}
            </div>

            {/* Nội dung khung chat */}
            {isOpen && (
                <div style={chatWindowStyle}>
                    <div style={headerStyle}>Hỏi đáp trực tuyến</div>
                    <div style={messageListStyle}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                textAlign: msg.sender?._id === userInfo._id ? 'right' : 'left',
                                margin: '10px'
                            }}>
                                <b style={{ fontSize: '12px', display: 'block' }}>
                                    {msg.sender?.fullName || 'Người dùng'}
                                </b>
                                <span style={msg.sender?._id === userInfo._id ? myMsgStyle : otherMsgStyle}>
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                    <form onSubmit={sendMessage} style={inputAreaStyle}>
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi..." 
                            style={inputStyle}
                        />
                        <button type="submit" style={sendBtnStyle}>Gửi</button>
                    </form>
                </div>
            )}
        </div>
    );
};

// --- CSS TRỰC TIẾP CHO XỊN XÒ ---
const containerStyle = { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 };
const toggleBtnStyle = { width: '120px', height: '40px', backgroundColor: '#007bff', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', fontWeight: 'bold' };
const chatWindowStyle = { width: '300px', height: '400px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', marginTop: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' };
const headerStyle = { padding: '10px', backgroundColor: '#007bff', color: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', fontWeight: 'bold' };
const messageListStyle = { flex: 1, overflowY: 'auto', padding: '10px' };
const myMsgStyle = { backgroundColor: '#007bff', color: 'white', padding: '8px', borderRadius: '10px', display: 'inline-block' };
const otherMsgStyle = { backgroundColor: '#f1f0f0', color: 'black', padding: '8px', borderRadius: '10px', display: 'inline-block' };
const inputAreaStyle = { display: 'flex', padding: '10px', borderTop: '1px solid #eee' };
const inputStyle = { flex: 1, border: '1px solid #ddd', borderRadius: '5px', padding: '5px' };
const sendBtnStyle = { marginLeft: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' };

export default ChatBox;