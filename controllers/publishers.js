const PublisherModel = require('../schemas/publishers');

const getAllPublishers = async (req, res) => {
    try {
        const publishers = await PublisherModel.find({});
        res.status(200).json({ success: true, data: publishers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPublisher = async (req, res) => {
    try {
        const newPublisher = new PublisherModel(req.body);
        const savedPublisher = await newPublisher.save();
        res.status(201).json({ success: true, message: "Tạo NXB thành công", data: savedPublisher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updatePublisher = async (req, res) => {
    try {
        const updatedPublisher = await PublisherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPublisher) return res.status(404).json({ success: false, message: "Không tìm thấy NXB" });
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedPublisher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deletePublisher = async (req, res) => {
    try {
        const deletedPublisher = await PublisherModel.findByIdAndDelete(req.params.id);
        if (!deletedPublisher) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllPublishers, createPublisher, updatePublisher, deletePublisher };