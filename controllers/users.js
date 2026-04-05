// Đường dẫn file: controllers/users.js
const UserModel = require('../schemas/users'); 

// 1. Hàm lấy danh sách tất cả người dùng (Read)
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json({ success: true, message: "Lấy danh sách người dùng thành công", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Hàm tạo người dùng mới (Create)
const createUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, message: "Tạo người dùng mới thành công", data: savedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Hàm cập nhật thông tin người dùng (Update)
const updateUser = async (req, res) => {
    try {
        // req.params.id chính là cái mã _id truyền trên đường dẫn URL
        const userId = req.params.id; 
        // req.body là dữ liệu mới muốn sửa
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true }); // {new: true} để trả về data sau khi đã sửa
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng này" });
        }
        res.status(200).json({ success: true, message: "Cập nhật người dùng thành công", data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Hàm xóa người dùng (Delete)
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng này để xóa" });
        }
        res.status(200).json({ success: true, message: "Đã xóa người dùng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xuất cả 4 hàm ra
module.exports = { 
    getAllUsers, 
    createUser,
    updateUser,
    deleteUser
};