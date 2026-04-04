const Cart = require('../schemas/carts');

// 1. Chức năng: Thêm sách vào giỏ
const addToCart = async (req, res) => {
    try {
        const { user, book } = req.body;

        // Kiểm tra xem cuốn sách này đã có trong giỏ của người này chưa?
        const alreadyInCart = await Cart.findOne({ user: user, book: book });
        
        if (alreadyInCart) {
            return res.status(400).json({
                success: false,
                message: "Cuốn sách này đã có trong giỏ của bạn rồi!"
            });
        }

        const newCartItem = await Cart.create({
            user: user,
            book: book
        });

        res.status(201).json({
            success: true,
            message: "Đã thêm vào giỏ sách thành công",
            data: newCartItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi thêm vào giỏ",
            error: error.message
        });
    }
};

// 2. Chức năng: Lấy toàn bộ giỏ sách của 1 người dùng
const getCartByUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

        // Lấy giỏ sách và kéo thêm thông tin chi tiết của cuốn sách ra
        const cartItems = await Cart.find({ user: userId }).populate('book');

        res.status(200).json({
            success: true,
            message: "Lấy giỏ sách thành công",
            data: cartItems
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi lấy giỏ sách",
            error: error.message
        });
    }
};

// 3. Chức năng: Xóa 1 cuốn sách ra khỏi giỏ
const removeFromCart = async (req, res) => {
    try {
        const cartItemId = req.params.id; // Lấy ID của món hàng trong giỏ

        // Tìm và xóa món hàng đó
        await Cart.findByIdAndDelete(cartItemId);

        res.status(200).json({
            success: true,
            message: "Đã xóa sách khỏi giỏ thành công"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi xóa sách khỏi giỏ",
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCartByUser,
    removeFromCart
};