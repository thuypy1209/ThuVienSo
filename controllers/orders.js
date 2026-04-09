const Order = require('../schemas/orders');
const Cart = require('../schemas/carts');
const Purchase = require('../schemas/purchases');
const { createPaymentUrl } = require('./payment');

const submitOrder = async (req, res) => {
    try {
        const { user, customerName, phone, email, address, paymentMethod } = req.body;
        const cartItems = await Cart.find({ user }).populate('book');
        if (cartItems.length === 0) return res.status(400).json({ success: false, message: "Giỏ hàng trống!" });

        let totalAmount = 0;
        const orderItems = cartItems.map(item => {
            const price = item.book.price || 0;
            totalAmount += price * item.quantity;
            return { book: item.book._id, quantity: item.quantity, price };
        });

        const shippingFee = (totalAmount > 1000000 && cartItems.length >= 2) ? 0 : 30000;
        const grandTotal = totalAmount + shippingFee;

        const order = await Order.create({
            user, items: orderItems, totalAmount, shippingFee, grandTotal,
            customerName, phone, email, address, paymentMethod
        });

        // Tạo record mua hàng (dùng cho cả COD và MoMo)
        for (const item of cartItems) {
            await Purchase.create({
                user,
                book: item.book._id,
                order: order._id
            });
        }

        await Cart.deleteMany({ user });

        if (paymentMethod === 'momo') {
            const momoOrderId = `ORD${order._id}`;
            const payUrl = await createPaymentUrl(momoOrderId, Math.round(grandTotal), `Thanh toán đơn #${order._id}`);
            return res.status(200).json({ success: true, data: { payUrl, orderId: order._id } });
        }

        res.status(200).json({ success: true, message: "Đặt hàng COD thành công!", data: { orderId: order._id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const testMoMoSuccess = async (req, res) => {
    try {
        const { user } = req.body;
        const latestOrder = await Order.findOne({ user, status: 'PENDING' }).sort({ createdAt: -1 });
        if (!latestOrder) return res.status(400).json({ success: false, message: "Không tìm thấy đơn hàng!" });

        latestOrder.status = 'PAID';
        await latestOrder.save();

        // Tạo purchase cho test
        const cartItems = await Cart.find({ user }).populate('book'); // fallback nếu còn cart
        for (const item of cartItems) {
            await Purchase.create({ user, book: item.book._id, order: latestOrder._id });
        }

        res.json({ success: true, message: "Test MoMo thành công (DEV)" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { submitOrder, testMoMoSuccess };