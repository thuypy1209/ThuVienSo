let BorrowRecordModel = require('../schemas/borrowRecords');


module.exports = {
    getAllRecords: async (req, res) => {
        try {
            const records = await BorrowRecordModel.find({})
                .populate('user', 'fullName email')
                .populate('book', 'title');
            res.status(200).json({ success: true, data: records });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createRecord: async (req, res) => {
        try {
            const newRecord = new BorrowRecordModel(req.body);
            const savedRecord = await newRecord.save();
            res.status(201).json({ success: true, message: "Tạo phiếu mượn thành công", data: savedRecord });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getAllRecords: async (req, res) => {
        try {
            const records = await BorrowRecordModel.find({})
                .populate('user', 'fullName email')
                .populate('book', 'title');
            res.status(200).json({ success: true, data: records });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createRecord: async (req, res) => {
        try {
            const newRecord = new BorrowRecordModel(req.body);
            const savedRecord = await newRecord.save();
            res.status(201).json({ success: true, message: "Tạo phiếu mượn thành công", data: savedRecord });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    updateRecord: async (req, res) => {
        try {
            const updatedRecord = await BorrowRecordModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedRecord) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu mượn" });
            res.status(200).json({ success: true, message: "Cập nhật phiếu mượn thành công", data: updatedRecord });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteRecord: async (req, res) => {
        try {
            const deletedRecord = await BorrowRecordModel.findByIdAndDelete(req.params.id);
            if (!deletedRecord) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
            res.status(200).json({ success: true, message: "Xóa phiếu mượn thành công" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
