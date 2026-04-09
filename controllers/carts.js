const Cart = require('../schemas/carts');
const Book = require('../schemas/books');

const addToCart = async (req, res) => {
    try {
        const { user, book, quantity = 1 } = req.body;
        const bookDoc = await Book.findById(book);
        if (!bookDoc || bookDoc.stock < quantity) {
            return res.status(400).json({ success: false, message: "Sách hết hàng hoặc không đủ số lượng!" });
        }
        let cartItem = await Cart.findOne({ user, book });
        if (cartItem) {
            cartItem.quantity += quantity;
            if (cartItem.quantity > bookDoc.stock) cartItem.quantity = bookDoc.stock;
            await cartItem.save();
            return res.status(200).json({ success: true, message: "Cập nhật số lượng thành công", data: cartItem });
        }
        const newCartItem = await Cart.create({ user, book, quantity });
        res.status(201).json({ success: true, message: "Đã thêm vào giỏ hàng", data: newCartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCartByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartItems = await Cart.find({ user: userId }).populate('book');
        res.status(200).json({ success: true, message: "Lấy giỏ hàng thành công", data: cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Đã xóa khỏi giỏ hàng" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Thêm hàm cập nhật số lượng (dùng cho +/- trong frontend)
const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const updated = await Cart.findByIdAndUpdate(id, { quantity }, { new: true }).populate('book');
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addToCart, getCartByUser, removeFromCart, updateQuantity };