// Đường dẫn file: controllers/books.js
const BookModel = require('../schemas/books');

// 1. Lấy danh sách Sách (Có nối bảng Category)
const getAllBooks = async (req, res) => {
    try {
        // Hàm populate giúp lấy toàn bộ thông tin của Category thay vì chỉ lấy mỗi cái ID
        const books = await BookModel.find({}).populate('category', 'name description');
        res.status(200).json({ success: true, message: "Lấy danh sách sách thành công", data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Tạo Sách mới
const createBook = async (req, res) => {
    try {
        const newBook = new BookModel(req.body);
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, message: "Thêm sách mới thành công", data: savedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Cập nhật Sách
const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updatedBook = await BookModel.findByIdAndUpdate(bookId, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
        res.status(200).json({ success: true, message: "Cập nhật sách thành công", data: updatedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Xóa Sách
const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await BookModel.findByIdAndDelete(bookId);
        if (!deletedBook) return res.status(404).json({ success: false, message: "Không tìm thấy sách để xóa" });
        res.status(200).json({ success: true, message: "Đã xóa sách thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllBooks, createBook, updateBook, deleteBook };