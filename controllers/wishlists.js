// File: controllers/wishlists.js
let WishlistModel = require('../schemas/wishlists');

module.exports = {
    // 1. Thêm sách vào tủ sách yêu thích (Chỉ nhận data, không dùng req, res)
    Create: async function (data) {
        // data sẽ chứa { user, book } được truyền từ Router sang
        const alreadyExists = await WishlistModel.findOne({ user: data.user, book: data.book });
        
        // Nếu đã tồn tại, ném ra lỗi để tầng Router tự bắt bằng try/catch
        if (alreadyExists) {
            throw new Error("Sách này đã có trong tủ sách yêu thích của bạn rồi!");
        }

        const newWishlistItem = await WishlistModel.create({
            user: data.user,
            book: data.book
        });
        
        return newWishlistItem;
    },

    // 2. Lấy danh sách sách yêu thích của 1 người dùng
    GetByUser: async function (userId) {
        // Vẫn giữ nguyên phép thuật .populate('book') của bạn!
        return await WishlistModel.find({ user: userId }).populate('book');
    },

    // 3. Xóa 1 sách khỏi danh sách yêu thích
    Delete: async function (id) {
        return await WishlistModel.findByIdAndDelete(id);
    }
};