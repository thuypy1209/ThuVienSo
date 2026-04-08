// File: controllers/ebookFiles.js
let EbookFileModel = require('../schemas/ebookFiles');

module.exports = {
    // 1. Lấy danh sách file Ebook (có kèm tên sách)
    GetAllE: async function () { 
        return await EbookFileModel.find({}).populate('book', 'title'); 
    },

    // 2. Lấy chi tiết 1 file Ebook (Tặng thêm cho bạn để đủ bộ)
    GetById: async function (id) {
        try {
            return await EbookFileModel.findById(id).populate('book', 'title');
        } catch (error) {
            return false;
        }
    },

    // 3. Thêm file sách (Chỉ nhận data)
    Create: async function (data) {
        let newEbook = new EbookFileModel(data);
        await newEbook.save();
        return newEbook;
    },

    // 4. Cập nhật file
    Update: async function (id, data) { 
        return await EbookFileModel.findByIdAndUpdate(id, data, { new: true }); 
    },

    // 5. Xóa file
    Delete: async function (id) { 
        return await EbookFileModel.findByIdAndDelete(id); 
    }
};