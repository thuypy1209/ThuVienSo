// File: controllers/authors.js
let AuthorModel = require('../schemas/authors');

module.exports = {
    // 1. Chỉ return danh sách, không dùng req, res
    GetAllAuthors: async function () { 
        return await AuthorModel.find({ isDeleted: { $ne: true } }); 
    },
    
    // 2. Chỉ nhận ID, return 1 tác giả
    GetAuthorById: async function (id) {
        try { 
            return await AuthorModel.findOne({ _id: id, isDeleted: { $ne: true } }); 
        } catch (error) { 
            return false; 
        }
    },
    
    // 3. Chỉ nhận Data, lưu và return tác giả mới
    createAuthor: async function (data) {
        let newAuthor = new AuthorModel(data);
        await newAuthor.save();
        return newAuthor;
    },
    
    // 4. Nhận ID và Data, update rồi return
    updateAuthor: async function (id, data) { 
        return await AuthorModel.findByIdAndUpdate(id, data, { new: true }); 
    },
    
    // 5. Xóa mềm (chuyển isDeleted thành true) thay vì xóa cứng
    deleteAuthor: async function (id) { 
        return await AuthorModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }); 
    }
};