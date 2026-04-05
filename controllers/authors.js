let AuthorModel = require('../schemas/authors');

module.exports = {
    GetAllAuthors: async function (req, res) {
        try {
            let authors = await AuthorModel.find({ isDeleted: { $ne: true } });
            res.status(200).json({ success: true, data: authors });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createAuthor: async (req, res) => {
        try {
            const newAuthor = new AuthorModel(req.body);
            const savedAuthor = await newAuthor.save();
            res.status(201).json({ success: true, message: "Tạo tác giả thành công", data: savedAuthor });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },


    updateAuthor: async (req, res) => {
        try {
            const updatedAuthor = await AuthorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedAuthor) return res.status(404).json({ success: false, message: "Không tìm thấy tác giả" });
            res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedAuthor });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteAuthor: async (req, res) => {
        try {
            const deletedAuthor = await AuthorModel.findByIdAndDelete(req.params.id);
            if (!deletedAuthor) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
            res.status(200).json({ success: true, message: "Xóa thành công" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
