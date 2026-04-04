const Wishlist = require('../schemas/wishlists');

// 1. Chức năng: Thêm sách vào tủ sách yêu thích
const addToWishlist = async (req, res) => {
    try {
        const { user, book } = req.body;

        // Bước 1: Kiểm tra xem user này đã thích cuốn sách này chưa?
        const alreadyExists = await Wishlist.findOne({ user: user, book: book });
        
        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Sách này đã có trong tủ sách yêu thích của bạn rồi!"
            });
        }

        // Bước 2: Nếu chưa có thì tạo mới
        const newWishlistItem = await Wishlist.create({
            user: user,
            book: book
        });

        res.status(201).json({
            success: true,
            message: "Đã thêm vào tủ sách yêu thích thành công",
            data: newWishlistItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi thêm sách yêu thích",
            error: error.message
        });
    }
};

// 2. Chức năng: Lấy danh sách sách yêu thích của 1 người dùng
const getWishlistByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy ID người dùng từ trên thanh URL xuống

        // Tìm tất cả dữ liệu có cột user khớp với ID này
        // Hàm .populate('book') giống như phép thuật: Thay vì chỉ trả về cái ID của sách, nó sẽ chạy sang bảng Book lấy luôn tên sách, tác giả, ảnh bìa... về cho mình.
        const list = await Wishlist.find({ user: userId }).populate('book');

        res.status(200).json({
            success: true,
            message: "Lấy tủ sách yêu thích thành công",
            data: list
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi lấy danh sách",
            error: error.message
        });
    }
};

// Xuất 2 hàm này ra để file Route dùng
module.exports = {
    addToWishlist,
    getWishlistByUser
};