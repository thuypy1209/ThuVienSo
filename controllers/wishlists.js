const Wishlist = require('../schemas/wishlists');

const addToWishlist = async (req, res) => {
    try {
        const { book, user } = req.body;

        if (!book || !user) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID sách hoặc ID người dùng rồi ní ơi!"
            });
        }

        const alreadyExists = await Wishlist.findOne({ user: user, book: book });

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Sách này đã có trong tủ sách yêu thích của bạn rồi!"
            });
        }
 
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

const getWishlistByUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

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

const removeFromWishlist = async (req, res) => {
    try {
        const wishId = req.params.id; 
        await Wishlist.findByIdAndDelete(wishId);
        
        res.status(200).json({
            success: true,
            message: "Đã xóa khỏi tủ sách yêu thích"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi xóa yêu thích",
            error: error.message
        });
    }
};

module.exports = {
    addToWishlist,
    getWishlistByUser,
    removeFromWishlist
};