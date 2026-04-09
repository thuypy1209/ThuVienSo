const crypto = require('crypto');
const Order = require('../schemas/orders');

const MOMO = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    returnUrl: 'http://localhost:3000/payment/return',
    notifyUrl: 'http://localhost:3000/payment/ipn',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create'
};

const createPaymentUrl = async (orderId, amount, orderInfo) => {
    const requestId = crypto.randomUUID();
    const requestType = 'captureWallet';
    const extraData = '';
    const rawSignature = `accessKey=${MOMO.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO.partnerCode}&redirectUrl=${MOMO.returnUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', MOMO.secretKey).update(rawSignature).digest('hex');

    const body = {
        partnerCode: MOMO.partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId, amount, orderId, orderInfo,
        redirectUrl: MOMO.returnUrl,
        ipnUrl: MOMO.notifyUrl,
        lang: "vi",
        extraData,
        requestType,
        signature
    };

    const res = await fetch(MOMO.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.resultCode === 0) return data.payUrl;
    throw new Error(data.message || 'Lỗi MoMo');
};

const handleReturn = async (req, res) => {
    const params = req.query;
    const signature = params.signature;
    let success = false;
    let message = 'Thanh toán thất bại';

    if (signature && verifySignature(params, signature)) {
        if (parseInt(params.resultCode) === 0) {
            success = true;
            message = 'Thanh toán MoMo thành công!';
        }
    }
    res.redirect(`http://localhost:5173/order-confirmation?success=${success}&message=${encodeURIComponent(message)}`);
};

const handleIpn = async (req, res) => {
    const params = req.body;
    const signature = params.signature;

    if (signature && verifySignature(params, signature) && parseInt(params.resultCode) === 0) {
        const momoOrderId = params.orderId;
        const orderId = momoOrderId.replace('ORD', '');

        const order = await Order.findByIdAndUpdate(orderId, { status: 'PAID' });

        // Tạo purchase record
        if (order) {
            const cartItems = await Cart.find({ user: order.user }); // fallback
            for (const item of cartItems) {
                await Purchase.create({
                    user: order.user,
                    book: item.book,
                    order: order._id
                });
            }
        }
    }
    res.status(204).send();
};

const verifySignature = (params, received) => {
    const signParams = { ...params };
    delete signParams.signature;
    signParams.accessKey = MOMO.accessKey;
    const sorted = Object.keys(signParams).sort();
    const raw = sorted.map(k => `${k}=${signParams[k]}`).join('&');
    const calc = crypto.createHmac('sha256', MOMO.secretKey).update(raw).digest('hex');
    return calc === received;
};

module.exports = { createPaymentUrl, handleReturn, handleIpn };