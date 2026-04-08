// File: controllers/books.js
let bookModel = require('../schemas/books');

module.exports = {
    // 1. Chỉ return danh sách sách chưa bị xóa mềm
    GetAllBook: async function () { 
        // Lời khuyên: Ở bảng sách, bạn có thể thêm .populate() ở đây để lấy luôn tên tác giả/thể loại nếu cần
        return await bookModel.find({ isDeleted: { $ne: true } }); 
    },
    
    // 2. Lấy chi tiết 1 cuốn sách theo ID
    GetBookById: async function (id) {
        try { 
            return await bookModel.findOne({ _id: id, isDeleted: { $ne: true } }); 
        } catch (error) { 
            return false; 
        }
    },
    
    // 3. Nhận data từ Router, lưu vào DB và return kết quả
    CreateBook: async function (data) {
        let newBook = new bookModel(data);
        await newBook.save();
        return newBook;
    },
    
    // 4. Cập nhật thông tin sách
    UpdateBook: async function (id, data) { 
        return await bookModel.findByIdAndUpdate(id, data, { new: true }); 
    },
    
    // 5. Xóa mềm sách (isDeleted = true)
    DeleteBook: async function (id) { 
        return await bookModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }); 
    }
}