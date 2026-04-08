// File: controllers/carts.js
let CartModel = require('../schemas/carts');

module.exports = {
    // 1. Thêm sách vào giỏ (Chỉ nhận data, nếu trùng thì ném lỗi ra)
    CreateCart: async function (data) {
        const alreadyInCart = await CartModel.findOne({ user: data.user, book: data.book });
        
        if (alreadyInCart) {
            throw new Error("Cuốn sách này đã có trong giỏ của bạn rồi!");
        }

        const newCartItem = await CartModel.create({
            user: data.user,
            book: data.book
        });
        return newCartItem;
    },

    // 2. Lấy toàn bộ giỏ sách của 1 người dùng
    GetByUser: async function (userId) {
        return await CartModel.find({ user: userId }).populate('book');
    },

    // 3. Xóa 1 cuốn sách ra khỏi giỏ
    DeleteCart: async function (id) {
        return await CartModel.findByIdAndDelete(id);
    }
};