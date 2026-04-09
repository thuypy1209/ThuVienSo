const BookModel = require('../schemas/books');

const getAllBooks = async (req, res) => {
    try {
        const filter = {};

        if (req.query.authorId) {
            filter.author = req.query.authorId;
        }

        const books = await BookModel.find(filter)
            .populate('category', 'name description')
            .populate('author', 'name');
        res.status(200).json({ success: true, message: "Lấy danh sách sách thành công", data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const newBook = new BookModel(req.body);
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, message: "Thêm sách mới thành công", data: savedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

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





const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await BookModel.findById(bookId).populate('category', 'name');
        
        if (!book) return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
        
        res.status(200).json({ success: true, message: "Lấy chi tiết sách thành công", data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { getAllBooks, createBook, updateBook, deleteBook, getBookById };