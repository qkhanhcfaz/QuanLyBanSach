const { Op } = require('sequelize');
const db = require('../models');
const { Post, User } = db;

// --- PUBLIC API ---

// Lấy danh sách bài viết (có tìm kiếm & phân trang)
const getPublicPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const keyword = req.query.keyword || '';

        const whereClause = {
            trang_thai: true
        };

        if (keyword) {
            whereClause.tieu_de = { [Op.like]: `%${keyword}%` };
        }

        const { count, rows } = await Post.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['ho_ten'] }]
        });

        // Trả về data format chuẩn cho cả API và View Controller dùng lại nếu cần
        res.json({
            posts: rows,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalPosts: count
        });

    } catch (error) {
        console.error('Lỗi lấy bài viết:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy chi tiết bài viết
const getPostDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({
            where: { id: id, trang_thai: true },
            include: [{ model: User, as: 'author', attributes: ['ho_ten'] }]
        });

        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- ADMIN API ---

// Tạo bài viết
const createPost = async (req, res) => {
    try {
        const { tieu_de, tom_tat, noi_dung, hinh_anh, trang_thai } = req.body;
        
        const newPost = await Post.create({
            tieu_de,
            tom_tat,
            noi_dung,
            hinh_anh,
            trang_thai: trang_thai === 'true' || trang_thai === true,
            user_id: req.user ? req.user.id : null
        });

        res.status(201).json({ message: 'Tạo bài viết thành công!', post: newPost });
    } catch (error) {
        console.error('Lỗi tạo bài viết:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật bài viết
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { tieu_de, tom_tat, noi_dung, hinh_anh, trang_thai } = req.body;

        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

        post.tieu_de = tieu_de;
        post.tom_tat = tom_tat;
        post.noi_dung = noi_dung;
        if (hinh_anh) post.hinh_anh = hinh_anh;
        post.trang_thai = trang_thai === 'true' || trang_thai === true;

        await post.save();

        res.json({ message: 'Cập nhật thành công!', post });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa bài viết
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

        await post.destroy();
        res.json({ message: 'Xóa thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy tất cả (cho Admin table)
const getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['ho_ten'] }]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getPublicPosts,
    getPostDetail,
    createPost,
    updatePost,
    deletePost,
    getAllPostsAdmin
};
