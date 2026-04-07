const Post = require('../schemas/posts');

const createPost = async (req, res) => {
    try {
        const { sender, content } = req.body;
        
        if (!content && !req.file) {
            return res.status(400).json({ success: false, message: "Bài viết phải có chữ hoặc ảnh nhé!" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const newPost = await Post.create({
            sender: sender,
            content: content || "",
            image: imageUrl
        });

        const populatedPost = await Post.findById(newPost._id).populate('sender', 'fullName');

        res.status(201).json({
            success: true,
            message: "Đăng bài thành công",
            data: populatedPost
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server khi đăng bài: " + error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('sender', 'fullName avatar')
            .populate('comments.user', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server khi lấy bài: " + error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết!" });

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
            
            if (post.sender.toString() !== userId) {
                await Notification.create({
                    user: post.sender,
                    title: "Có người thích bài viết của bạn",
                    message: "Một sinh viên vừa thả tim bài viết của bạn trên Diễn đàn.",
                    type: "system"
                });
            }
        }

        await post.save();
        res.status(200).json({ success: true, data: post.likes });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, text } = req.body;

        let imageUrl = "";
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết!" });

        const newComment = {
            user: userId,
            text: text || "",
            image: imageUrl
        };
        post.comments.push(newComment);
        await post.save();

        if (post.sender.toString() !== userId) {
            await Notification.create({
                user: post.sender,
                title: "Bình luận mới",
                message: "Có người vừa bình luận vào bài viết của bạn. Vào xem ngay!",
                type: "system"
            });
        }

        const updatedPost = await Post.findById(postId).populate('comments.user', 'fullName avatar');
        const savedComment = updatedPost.comments[updatedPost.comments.length - 1];

        res.status(201).json({ success: true, data: savedComment });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    likePost,
    commentPost
};


