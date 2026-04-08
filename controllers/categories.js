let CategoryModel = require('../schemas/categories');

module.exports = {
    // 1. Chỉ return danh sách, không dùng req, res
    GetAllCategories: async function () { 
        return await CategoryModel.find({ isDeleted: false }); 
    },
    
    // 2. Lấy chi tiết
    GetCategoryById: async function (id) {
        try { 
            return await CategoryModel.findOne({ isDeleted: false, _id: id }); 
        } catch (error) { 
            return false; 
        }
    },
    
    // 3. Chỉ nhận data, lưu DB và return
    CreateCategory: async function (data) {
        let newItem = new CategoryModel(data);
        await newItem.save();
        return newItem;
    },
    
    // 4. Cập nhật
    UpdateCategory: async function (id, data) { 
        return await CategoryModel.findByIdAndUpdate(id, data, { new: true }); 
    },
    
    // 5. Xóa mềm
    DeleteCategory: async function (id) { 
        return await CategoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }); 
    }
};