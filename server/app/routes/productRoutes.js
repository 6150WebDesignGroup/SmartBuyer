const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const adminController = require('../controllers/adminController');

// Category Routes
router.post("/createCate", upload.single("imgFile"), adminController.createCategory);
router.post("/delete", upload.none(), adminController.deleteCategory);
router.post("/editCategory", adminController.editCategory);
router.get("/getAllCategory", adminController.getAllCategories);

// Product Routes
router.get("/byCategory", adminController.getProductsByCategory);
router.post("/add", upload.array("imgFile", 5), adminController.addProduct);
router.put("/edit", upload.array("imgFile", 5), adminController.editProduct);
router.delete("/delete", adminController.deleteProduct);

module.exports = router;
