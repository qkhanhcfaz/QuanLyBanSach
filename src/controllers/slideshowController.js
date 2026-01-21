const { Slideshow } = require("../models");

// API: Lấy danh sách public (cho trang chủ)
const getPublicSlideshows = async (req, res) => {
  try {
    const slideshows = await Slideshow.findAll({
      where: { trang_thai: true },
      order: [["thu_tu_hien_thi", "ASC"]],
    });
    res.json(slideshows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi lấy danh sách slideshow", detail: error.message });
  }
};

// API: Tạo mới (cho Admin)
const createSlideshow = async (req, res) => {
  try {
    // Nếu có file upload thì lấy path, còn không thì lấy từ body (nếu nhập URL)
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/posts/${req.file.filename}`;
    }

    const { tieu_de, phu_de, link_to, thu_tu_hien_thi, trang_thai } = req.body;

    await Slideshow.create({
      image_url: imageUrl,
      tieu_de,
      phu_de,
      link_to,
      thu_tu_hien_thi: thu_tu_hien_thi || 0,
      trang_thai: trang_thai === "on" || trang_thai === true,
    });

    res.redirect("/admin/slideshows");
  } catch (error) {
    console.error("Create Slide Error:", error);
    res.status(500).send("Lỗi tạo slide");
  }
};

// API: Cập nhật (cho Admin)
const updateSlideshow = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Slideshow.findByPk(id);

    if (!slide) {
      return res.status(404).send("Slide không tồn tại");
    }

    let imageUrl = slide.image_url;
    if (req.file) {
      imageUrl = `/uploads/posts/${req.file.filename}`;
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

    const { tieu_de, phu_de, link_to, thu_tu_hien_thi, trang_thai } = req.body;

    await slide.update({
      image_url: imageUrl,
      tieu_de,
      phu_de,
      link_to,
      thu_tu_hien_thi: thu_tu_hien_thi || 0,
      trang_thai: trang_thai === "on" || trang_thai === true,
    });

    res.redirect("/admin/slideshows");
  } catch (error) {
    console.error("Update Slide Error:", error);
    res.status(500).send("Lỗi cập nhật slide");
  }
};

// API: Xóa (cho Admin)
const deleteSlideshow = async (req, res) => {
  try {
    const { id } = req.params;
    await Slideshow.destroy({ where: { id } });
    res.redirect("/admin/slideshows");
  } catch (error) {
    console.error("Delete Slide Error:", error);
    res.status(500).send("Lỗi xóa slide");
  }
};

module.exports = {
  getPublicSlideshows,
  createSlideshow,
  updateSlideshow,
  deleteSlideshow,
};
