// File: controllers/posts.js
let PostModel = require('../schemas/posts');

module.exports = {
    // 1. Lấy danh sách (Chỉ lấy bài chưa xóa)
    GetAllPosts: async function () {
        return await PostModel.find({ isDeleted: { $ne: true } });
    },

    // 2. Lấy chi tiết 1 bài viết
    GetById: async function (id) {
        try {
            return await PostModel.findOne({ _id: id, isDeleted: { $ne: true } });
        } catch (error) {
            return false;
        }
    },

    // 3. Tạo bài viết (Chỉ nhận data)
    CreatePost: async function (data) {
        let newPost = new PostModel(data);
        await newPost.save();
        return newPost;
    },

    // 4. Cập nhật bài viết
    UpdatePost: async function (id, data) {
        return await PostModel.findByIdAndUpdate(id, data, { new: true });
    },

    // 5. Xóa mềm (isDeleted = true)
    DeletePost: async function (id) {
        return await PostModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
};