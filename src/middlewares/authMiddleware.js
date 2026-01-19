const jwt = require("jsonwebtoken");
const db = require("../models");

/**
 * Middleware để bảo vệ các route yêu cầu đăng nhập.
 * Nó có thể lấy token từ httpOnly cookie (cho các trang render bằng EJS)
 * hoặc từ Authorization header (cho các API được gọi bằng JavaScript).
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Ưu tiên tìm token trong httpOnly cookie.
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Nếu không có trong cookie, thử tìm trong Authorization header.
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Nếu sau cả hai bước trên vẫn không có token, xử lý lỗi.
  if (!token) {
    if (req.originalUrl.startsWith("/admin")) {
      return res.redirect("/login?message=unauthenticated");
    }
    return res
      .status(401)
      .json({ message: "Xác thực thất bại, không tìm thấy token." });
  }

  try {
    // Giải mã token để lấy ID người dùng.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ DB
    req.user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ["mat_khau"] },
      include: {
        model: db.Role,
        as: "role",
      },
    });

    if (!req.user) {
      if (req.originalUrl.startsWith("/admin")) {
        return res.redirect("/login?message=user-not-found");
      }
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }

    next();
  } catch (err) {
    console.error("Lỗi xác thực token:", err.message);
    if (req.originalUrl.startsWith("/admin")) {
      return res.redirect("/login?message=invalid-token");
    }
    return res
      .status(401)
      .json({ message: "Xác thực thất bại, token không hợp lệ." });
  }
};

/**
 * Middleware để kiểm tra quyền Admin.
 * Lưu ý: Middleware này PHẢI được dùng SAU middleware `protect`.
 */
const admin = (req, res, next) => {
  // Kiểm tra user va role
  // Hỗ trợ cả check theo ten_quyen = 'admin' và role_id = 1 (tuỳ logic DB)
  if (
    req.user &&
    (req.user.role?.ten_quyen === "admin" || req.user.role_id === 1)
  ) {
    return next();
  }

  // Nếu không phải admin
  if (req.originalUrl.startsWith("/admin")) {
    return res.status(403).render("pages/error", {
      title: "403 - Bị cấm",
      message:
        "Bạn không có quyền truy cập vào trang này. Yêu cầu quyền Admin.",
    });
  }

  return res
    .status(403)
    .json({ message: "Không có quyền truy cập, yêu cầu quyền Admin." });
};

// Middleware checkUser: Kiểm tra user đã đăng nhập chưa (cho các views) nhưng KHÔNG chặn request nếu chưa đăng nhập.
const checkUser = async (req, res, next) => {
  let token;

  // 1. Kiểm tra cookie (ưu tiên cho Views)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Kiểm tra header (cho API nếu cần dùng chung middleware này)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.User.findByPk(decoded.id, {
        attributes: { exclude: ["mat_khau"] },
        include: { model: db.Role, as: "role" },
      });

      if (user) {
        req.user = user;
        res.locals.user = user; // Để EJS có thể truy cập biến `user`
      } else {
        res.locals.user = null;
      }
    } catch (error) {
      console.error("Check user error:", error.message);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = { protect, admin, checkUser };
