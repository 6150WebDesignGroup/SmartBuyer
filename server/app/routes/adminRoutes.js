const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const pageController = require('../controllers/pageController');

// 背景图
router.post("/uploadBackgroundImg", upload.single("imgFile"), pageController.uploadBackgroundImg);

// 轮播图上传
router.post("/uploadCarouseImg", upload.single("imgFile"), pageController.uploadCarouseImg);

// 轮播图删除（按路径名）
router.post("/deleteCarouseImg", pageController.deleteCarouseImg);

module.exports = router;
