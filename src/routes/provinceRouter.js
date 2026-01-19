const express = require('express');
const router = express.Router();

const { getProvinces, getDistricts, getWards } = require('../controllers/provinceController');

// Lấy danh sách tất cả tỉnh/thành
router.get('/', getProvinces);

// Lấy danh sách quận/huyện theo ID tỉnh
router.get('/districts/:id', getDistricts);

// Lấy danh sách phường/xã theo ID huyện
router.get('/wards/:id', getWards);

module.exports = router;
