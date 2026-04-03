const EbookFileModel = require('../schemas/ebookFiles');

const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await EbookFileModel.find({}).populate('book', 'title');
        res.status(200).json({ success: true, data: ebooks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEbook = async (req, res) => {
    try {
        const newEbook = new EbookFileModel(req.body);
        const savedEbook = await newEbook.save();
        res.status(201).json({ success: true, message: "Thêm file sách thành công", data: savedEbook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateEbook = async (req, res) => {
    try {
        const updatedEbook = await EbookFileModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEbook) return res.status(404).json({ success: false, message: "Không tìm thấy file" });
        res.status(200).json({ success: true, message: "Cập nhật file thành công", data: updatedEbook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteEbook = async (req, res) => {
    try {
        const deletedEbook = await EbookFileModel.findByIdAndDelete(req.params.id);
        if (!deletedEbook) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
        res.status(200).json({ success: true, message: "Xóa file thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllEbooks, createEbook, updateEbook, deleteEbook };