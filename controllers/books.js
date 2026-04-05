let bookModel = require('../schemas/books');

module.exports = {
    // 1. Lấy danh sách tất cả các sách
    GetAllBooks: async function (req, res) {
        try {
            // Giả sử schema của bạn có trường isDeleted để xóa mềm
            // Bạn có thể thêm .populate('author') hoặc .populate('category') nếu có liên kết bảng
            let books = await bookModel.find({ isDeleted: { $ne: true } });
            res.status(200).json({ success: true, data: books });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 2. Lấy thông tin chi tiết một cuốn sách theo ID
    GetBookById: async function (req, res) {
        try {
            let book = await bookModel.findById(req.params.id);
            if (!book || book.isDeleted) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
            }
            res.status(200).json({ success: true, data: book });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 3. Thêm sách mới
    CreateBook: async function (req, res) {
        try {
            let newBook = new bookModel(req.body); // req.body chứa thông tin sách từ Frontend gửi lên
            await newBook.save();
            res.status(201).json({ success: true, data: newBook, message: "Thêm sách thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // 4. Cập nhật thông tin sách
    UpdateBook: async function (req, res) {
        try {
            let updatedBook = await bookModel.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { new: true } // Thuộc tính new: true giúp trả về document sau khi đã update
            );
            if (!updatedBook) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sách để cập nhật" });
            }
            res.status(200).json({ success: true, data: updatedBook, message: "Cập nhật thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // 5. Xóa sách (Khuyên dùng xóa mềm - Soft Delete)
    DeleteBook: async function (req, res) {
        try {
            // Thay vì dùng findByIdAndDelete, ta chuyển trạng thái isDeleted = true
            let deletedBook = await bookModel.findByIdAndUpdate(
                req.params.id,
                { isDeleted: true },
                { new: true }
            );
            
            if (!deletedBook) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sách để xóa" });
            }
            res.status(200).json({ success: true, message: "Đã xóa sách thành công" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}