// File: controllers/reviews.js
let ReviewModel = require('../schemas/reviews');

module.exports = {
    // 1. Lấy tất cả đánh giá trên hệ thống
    GetAll: async function () {
        return await ReviewModel.find({})
            .populate('user', 'fullName')
            .populate('book', 'title');
    },

    // 2. Lấy chi tiết 1 đánh giá
    GetById: async function (id) {
        try {
            return await ReviewModel.findById(id)
                .populate('user', 'fullName')
                .populate('book', 'title');
        } catch (error) {
            return false;
        }
    },

    // 3. (MỚI) Lấy toàn bộ đánh giá của 1 cuốn sách (Xếp mới nhất lên đầu)
    GetByBook: async function (bookId) {
        return await ReviewModel.find({ book: bookId })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 }); 
    },

    // 4. Viết đánh giá (Chỉ nhận data)
    Create: async function (data) {
        let newReview = new ReviewModel(data);
        await newReview.save();
        return newReview;
    },

    // 5. Sửa đánh giá
    Update: async function (id, data) {
        return await ReviewModel.findByIdAndUpdate(id, data, { new: true });
    },

    // 6. Xóa đánh giá
    Delete: async function (id) {
        return await ReviewModel.findByIdAndDelete(id);
    }
};