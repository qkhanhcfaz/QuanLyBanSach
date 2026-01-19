const fetch = require('node-fetch');

// API gốc của esgoo.net trả về JSON có cấu trúc:
// { error: 0, error_text: "...", data: [...] }
// Chúng ta sẽ proxy lại y hệt cấu trúc này cho client.

const getProvinces = async (req, res) => {
    try {
        const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Lỗi lấy danh sách tỉnh:", error);
        res.status(500).json({ error: 1, error_text: "Lỗi server lấy danh sách tỉnh" });
    }
};

const getDistricts = async (req, res) => {
    try {
        const { id } = req.params; // ID của tỉnh
        const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${id}.htm`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Lỗi lấy danh sách huyện (Tỉnh: ${req.params.id}):`, error);
        res.status(500).json({ error: 1, error_text: "Lỗi server lấy danh sách huyện" });
    }
};

const getWards = async (req, res) => {
    try {
        const { id } = req.params; // ID của huyện
        const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${id}.htm`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Lỗi lấy danh sách xã (Huyện: ${req.params.id}):`, error);
        res.status(500).json({ error: 1, error_text: "Lỗi server lấy danh sách xã" });
    }
};

module.exports = {
    getProvinces,
    getDistricts,
    getWards
};
