const Post = require('../schemas/posts');
const Notification = require('../schemas/notifications');   // ← Quan trọng

// ====================== TẠO BÀI VIẾT ======================
const createPost = async (req, res) => {
    try {
        console.log('=== DEBUG CREATE POST ===');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'Không có file');

        const { sender, content } = req.body;

        if (!sender) {
            return res.status(400).json({ success: false, message: "Thiếu sender (userId)!" });
        }
        if (!content && !req.file) {
            return res.status(400).json({ success: false, message: "Bài viết phải có chữ hoặc ảnh nhé!" });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newPost = await Post.create({
            sender,
            content: content || "",
            image: imageUrl
        });

        const populatedPost = await Post.findById(newPost._id)
            .populate('sender', 'fullName avatar');

        res.status(201).json({
            success: true,
            message: "Đăng bài thành công",
            data: populatedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi Server khi đăng bài: " + error.message });
    }
};

// ====================== LẤY TẤT CẢ BÀI VIẾT ======================
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('sender', 'fullName avatar')
            .populate('comments.user', 'fullName avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server khi lấy bài: " + error.message });
    }
};

// ====================== LIKE BÀI VIẾT ======================
const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết!" });

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);

            if (post.sender.toString() !== userId) {
                await Notification.create({
                    user: post.sender,
                    message: "Một sinh viên vừa thả tim bài viết của bạn trên Diễn đàn.",
                    isRead: false
                });
            }
        }

        await post.save();
        res.status(200).json({ success: true, data: post.likes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ====================== BÌNH LUẬN ======================
const commentPost = async (req, res) => {
    try {
        console.log('=== DEBUG COMMENT POST ===');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'Không có file');

        const postId = req.params.id;
        const { userId, text } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Thiếu userId!" });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết!" });

        const newComment = {
            user: userId,
            text: text || "",
            image: imageUrl
        };

        post.comments.push(newComment);
        await post.save();

        // Gửi thông báo cho người đăng bài (nếu không phải chính mình)
        if (post.sender.toString() !== userId) {
            await Notification.create({
                user: post.sender,
                message: "Có người vừa bình luận vào bài viết của bạn. Vào xem ngay!",
                isRead: false
            });
        }

        const updatedPost = await Post.findById(postId)
            .populate('comments.user', 'fullName avatar');

        const savedComment = updatedPost.comments[updatedPost.comments.length - 1];

        res.status(201).json({
            success: true,
            message: "Bình luận thành công",
            data: savedComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    likePost,
    commentPost
};