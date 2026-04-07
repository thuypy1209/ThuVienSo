const Cart = require('../schemas/carts');

const addToCart = async (req, res) => {
    try {
        const { user, book } = req.body;

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

const getCartByUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

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

const removeFromCart = async (req, res) => {
    try {
        const cartItemId = req.params.id;

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