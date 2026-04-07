const CategoryModel = require('../schemas/categories');

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({});
        res.status(200).json({ success: true, message: "Lấy danh sách danh mục thành công", data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const newCategory = new CategoryModel(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json({ success: true, message: "Tạo danh mục thành công", data: savedCategory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, req.body, { new: true });
        
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
        }
        res.status(200).json({ success: true, message: "Cập nhật danh mục thành công", data: updatedCategory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
        
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục để xóa" });
        }
        res.status(200).json({ success: true, message: "Đã xóa danh mục thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };