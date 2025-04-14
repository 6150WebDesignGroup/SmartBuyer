const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const adminController = require('../controllers/adminController');

// 背景图
router.post("/uploadBackgroundImg", upload.single("imgFile"), adminController.uploadBackgroundImg);

// 轮播图上传
router.post("/uploadCarouseImg", upload.single("imgFile"), adminController.uploadCarouseImg);

// 轮播图删除（按路径名）
router.post("/deleteCarouseImg", adminController.deleteCarouseImg);

module.exports = router;
