const express = require('express');
const Admin = require('../model/User');
const PageSetup = require('../model/PageSetup');
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
const ProductCategory = require("../model/ProductCategory");
const Product = require("../model/Product");

///////////////////////////img upload////////////////////////////
// multer fun
// search from Internet
const storage = multer.diskStorage({
    destination: function (req,file, cb) {
        cb(null, "imgs");
    },
    filename: function (req,file, cb) {
        const filename = "ProductImg-"+file.originalname;
        cb(null, filename);
    }
})
const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG/PNG/GIF files are allowed."));
    }
};
const upload = multer({storage,fileFilter});



/**
 *  Category
 */

/**
 *  create Category
 */
router.post("/createCate",upload.single("imgFile"),async (req,res)=>{
    const {name,desc} = req.body;
    // if unique
    const proCateTest = await ProductCategory.findOne({name:name});
    if(proCateTest){
        return res.status(400).json({error:"name ready used"});
    }
    const productCate = new ProductCategory({
       name,
       desc,
    });
    await productCate.save();
    return res.status(200).json({Category:productCate});
})


/**
 *  delete Category && products
 */
router.post("/delete", upload.none(), async (req, res) => {
    try {
        const cateId = req.body.id;
        if (!cateId) {
            return res.status(400).json({ error: "Missing category ID" });
        }
        const category = await ProductCategory.findOne({ Id: cateId });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        const categoryName = category.name;

        await ProductCategory.deleteOne({ Id: cateId });

        // 删除该分类下所有产品
        await Product.deleteMany({ categoryName: categoryName });

        return res.status(200).json({ message: "Category and related products deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * edit Category
 */
router.post("/editCategory",  async (req, res) => {
    try {
        const Category = await ProductCategory.findOne({ Id: req.body.id });

        if (!Category) {
            return res.status(404).json({ message: "Category not found" });
        }

        Category.name = req.body.name || Category.name;
        Category.desc = req.body.desc || Category.desc;

        await Category.save();

        return res.json({ message: "Category updated", category: Category });
    } catch (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ message: "Server error" });
    }
});


/**
 * get All Category
 */
router.get("/getAllCategory",async (req,res)=>{
    const Categories = await ProductCategory.find();
    return res.status(200).json({Catagories: Categories});
})

/**
 * get Product by Category and Page
 * only use the query in the get method
 */
router.get("/byCategory", async (req, res) => {
    try {
        const { categoryName, page = 1 } = req.query;
        const pageSize = 4;

        if (!categoryName) {
            return res.status(400).json({ error: "categoryName is required" });
        }

        const query = { categoryName };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / pageSize),
            totalProducts: total,
            products,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});



/**
 * add product && imgs
 *
 * maximum 5 imgs
 */
router.post("/add", upload.array("imgFile", 5), async (req, res) => {
    try {
        const { name, categoryName, desc, price, ProductNumber } = req.body;

        if (!name || !categoryName || !desc || !price || !ProductNumber) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }
        const imagePaths = req.files.map(file => "imgs/Product/" + file.filename);
        const newProduct = new Product({
            name,
            categoryName,
            desc,
            price,
            ProductNumber,
            ProductImages: imagePaths
        });

        await newProduct.save();

        return res.status(200).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (err) {
        console.error(err);
        if (err.message === "Only JPEG/PNG/GIF files are allowed.") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Server error" });
    }
});


/**
 * edit product
 */
router.put("/edit", upload.array("imgFile", 5), async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Product ID is required" });

        const product = await Product.findOne({ Id: id });
        if (!product) return res.status(404).json({ error: "Product not found" });

        // 只更新前端传来的字段（保持原值）
        const updatableFields = ["name", "categoryName", "desc", "price", "ProductNumber"];

        updatableFields.forEach((field) => {
            if (req.body[field]) {
                product[field] = req.body[field];
            }
        });

        // 如果上传了新图片，则更新 ProductImages
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => "imgs/Product/" + file.filename);
            product.ProductImages = imagePaths;
        }

        await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



/**
 * delete Product
 */
router.delete("/delete", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const product = await Product.findOne({ Id: id });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await Product.deleteOne({ Id: id });

        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router;