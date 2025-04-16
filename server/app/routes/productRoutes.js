const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');

// Category Routes
router.post("/createCate", upload.single("imgFile"), adminController.createCategory);
router.post("/deleteCate", upload.none(), adminController.deleteCategory);
router.post("/editCategory", adminController.editCategory);
router.get("/getAllCategory", adminController.getAllCategories);

// Product Routes
router.post("/byCategory", adminController.getProductsByCategory);
router.post("/add", upload.array("imgFile", 5), adminController.addProduct);
router.put("/edit", upload.array("imgFile", 5), adminController.editProduct);
router.delete("/delete", adminController.deleteProduct);

// sort todo
// search Name desc
router.post('/searchProduct',productController.searchProduct);
// 输入 name , price ,time 表示通过不同的需求排序
router.post("/getAllAndSortByCate",productController.getAllByCategory);


module.exports = router;
