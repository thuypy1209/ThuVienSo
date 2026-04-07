const BorrowRecord = require('../schemas/borrowRecords');
const Cart = require('../schemas/carts');

const getMyHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await BorrowRecord.find({ user: userId }).populate('book');

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

const checkoutCart = async (req, res) => {
    try {
        const { user } = req.body;

        const cartItems = await Cart.find({ user: user });
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Giỏ hàng trống à ní ơi!" });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const records = cartItems.map(item => ({
            user: user,
            book: item.book,
            dueDate: dueDate,
            status: 'Đang mượn'
        }));

        await BorrowRecord.insertMany(records);

        await Cart.deleteMany({ user: user });

        res.status(201).json({
            success: true,
            message: "Mượn sách thành công rồi nhé! Hãy ra quầy nhận sách."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server khi mượn: " + error.message });
    }
};

const getAllRecords = async (req, res) => { /* Xử lý lấy tất cả cho Admin */ };
const updateRecord = async (req, res) => { /* Xử lý cập nhật trạng thái */ };
const deleteRecord = async (req, res) => { /* Xử lý xóa đơn mượn */ };

module.exports = {
    getMyHistory,
    checkoutCart,
    getAllRecords,
    updateRecord,
    deleteRecord
};