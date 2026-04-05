// Đường dẫn file: controllers/reviews.js
let ReviewModel = require('../schemas/reviews');

module.exports = {
    getAllReviews: async (req, res) => {
        try {
            // Dùng populate để lấy luôn tên User và tên Sách cho dễ nhìn
            const reviews = await ReviewModel.find({})
                .populate('user', 'fullName')
                .populate('book', 'title');
            res.status(200).json({ success: true, data: reviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createReview: async (req, res) => {
        try {
            const newReview = new ReviewModel(req.body);
            const savedReview = await newReview.save();
            res.status(201).json({ success: true, message: "Đánh giá thành công", data: savedReview });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    updateReview: async (req, res) => {
        try {
            const updatedReview = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedReview) return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
            res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedReview });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const deletedReview = await ReviewModel.findByIdAndDelete(req.params.id);
            if (!deletedReview) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
            res.status(200).json({ success: true, message: "Xóa thành công" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
