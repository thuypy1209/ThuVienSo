// File: controllers/borrowRecords.js
let BorrowRecordModel = require('../schemas/borrowRecords');

module.exports = {
    // 1. Lấy tất cả phiếu mượn (Giữ nguyên populate siêu xịn của bạn)
    GetAll: async function () { 
        return await BorrowRecordModel.find({})
            .populate('user', 'fullName email')
            .populate('book', 'title');
    },
    
    // 2. Lấy chi tiết 1 phiếu mượn (Bổ sung thêm cho đủ bộ)
    GetById: async function (id) {
        try { 
            return await BorrowRecordModel.findById(id)
                .populate('user', 'fullName email')
                .populate('book', 'title');
        } catch (error) { 
            return false; 
        }
    },
    
    // 3. Tạo phiếu mượn mới (Chỉ nhận data, không req res)
    Create: async function (data) {
        let newRecord = new BorrowRecordModel(data);
        await newRecord.save();
        return newRecord;
    },
    
    // 4. Cập nhật phiếu mượn (VD: Cập nhật trạng thái đã trả sách)
    Update: async function (id, data) { 
        return await BorrowRecordModel.findByIdAndUpdate(id, data, { new: true }); 
    },
    
    // 5. Xóa phiếu mượn
    Delete: async function (id) { 
        return await BorrowRecordModel.findByIdAndDelete(id); 
    }
};