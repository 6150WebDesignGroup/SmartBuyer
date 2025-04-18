const ProductCategory = require("../model/ProductCategory");
const Product = require("../model/Product");




////////////////////product 相关//////////////////////////////////

exports.createCategory = async (req, res) => {
    const { name, desc } = req.body;
    const exists = await ProductCategory.findOne({ name });
    if (exists) return res.status(400).json({ error: "name already used" });

    const category = new ProductCategory({ name, desc });
    await category.save();
    res.status(200).json({ category });
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Missing category ID" });

        const category = await ProductCategory.findOne({ProductCateId: id });
        if (!category) return res.status(404).json({ error: "Category not found" });

        await ProductCategory.deleteOne({ ProductCateId: id });
        await Product.deleteMany({ categoryName: category.name });

        res.status(200).json({ message: "Category and products deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.editCategory = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({ ProductCateId: req.body.id });
        if (!category) return res.status(404).json({ message: "Category not found" });

        category.name = req.body.name || category.name;
        category.desc = req.body.desc || category.desc;
        await category.save();

        res.json({ message: "Category updated", category });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllCategories = async (req, res) => {
    const categories = await ProductCategory.find();
    res.status(200).json({ categories });
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId, page = 1 } = req.body;

        if (!categoryId) {
            return res.status(400).json({ error: "categoryId is required" });
        }

        const pageSize = 6;
        const query = { categoryId: Number(categoryId) };  // 确保类型一致

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / pageSize),
            totalProducts: total,
            products
        });
    } catch (err) {
        console.error("getProductsByCategory error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


// add product  must accept all the data flied
exports.addProduct = async (req, res) => {
    try {
        const {
            name,
            categoryId,
            cardDesc,
            pageDesc,
            price,
            ProductNumber,
            ProductDeliveryTime,
            ProductQuantity
        } = req.body;
        if (
            !name || !categoryId || !cardDesc || !pageDesc ||
            !price || !ProductNumber || !ProductDeliveryTime || !ProductQuantity
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }
        const category = await ProductCategory.findOne({ ProductCateId: categoryId });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        const images = req.files.map(file => "imgs/Product/" + file.filename);
        const product = new Product({
            name,
            categoryId: category.ProductCateId,
            categoryName: category.name,
            cardDesc,
            pageDesc,
            price,
            ProductNumber,
            ProductQuantity,
            ProductDeliveryTime,
            deliveryTime: parseInt(ProductDeliveryTime), // 可选：作为数字用于排序
            ProductImages: images
        });

        await product.save();

        res.status(200).json({ message: "Product created", product });

    } catch (err) {
        console.error("Add Product Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


exports.editProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Product ID is required" });

        const product = await Product.findOne({ ProductId: id });
        if (!product) return res.status(404).json({ error: "Product not found" });

        // 可修改字段列表
        const fields = ["name", "categoryId", "cardDesc", "pageDesc", "price", "ProductQuantity", "ProductDeliveryTime", "deliveryTime"];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // 如果有上传新图片，覆盖旧图
        if (req.files && req.files.length > 0) {
            product.ProductImages = req.files.map(file => "imgs/Product/" + file.filename);
        }

        // 可选：更新 categoryName 对应字段
        if (req.body.categoryId) {
            const category = await ProductCategory.findOne({ ProductCateId: req.body.categoryId });
            if (category) product.categoryName = category.name;
        }

        await product.save();
        res.status(200).json({ message: "Product updated", product });
    } catch (err) {
        console.error("Edit error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Product ID is required" });

        const product = await Product.findOne({ ProductId: id });
        if (!product) return res.status(404).json({ error: "Product not found" });

        await Product.deleteOne({ ProductId: id });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



//////////////////////////////// pageSettings/////////////////////////////
const PageSetup = require("../model/PageSetup");

exports.uploadBackgroundImg = async (req, res) => {
    try {
        let pageImg = await PageSetup.findOne();
        if (!pageImg) {
            pageImg = new PageSetup({
                BackgroundImg: "",
                Title: "",
                Description: "",
                CarouselImg: [],
                lastUpdated: new Date()
            });
        }
        const filePath = "imgs/" + req.file.filename;
        pageImg.BackgroundImg = filePath;
        pageImg.lastUpdated = new Date();
        await pageImg.save();

        return res.status(200).json({
            message: "Background image uploaded successfully",
            imagePath: filePath
        });
    } catch (err) {
        if (err.message.includes("Only JPEG/PNG/GIF")) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

exports.uploadCarouseImg = async (req, res) => {
    try {
        let pageImg = await PageSetup.findOne();
        if (!pageImg) {
            pageImg = new PageSetup({
                BackgroundImg: "",
                Title: "",
                Description: "",
                CarouselImg: [],
                lastUpdated: new Date()
            });
        }
        const filePath = "imgs/" + req.file.filename;
        pageImg.CarouselImg.push(filePath);
        pageImg.lastUpdated = new Date();
        await pageImg.save();

        return res.status(200).json({
            message: "Carousel image uploaded successfully",
            imagePath: filePath,
            CarouselImg: pageImg.CarouselImg
        });
    } catch (err) {
        if (err.message.includes("Only JPEG/PNG/GIF")) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCarouseImg = async (req, res) => {
    try {
        const { deletImg } = req.body;
        if (!deletImg) return res.status(400).json({ error: "Image path required" });

        const pageImg = await PageSetup.findOne();
        if (!pageImg) return res.status(404).json({ error: "Page data not found" });

        pageImg.CarouselImg = pageImg.CarouselImg.filter(path => path !== deletImg);
        pageImg.lastUpdated = new Date();
        await pageImg.save();

        return res.status(200).json({
            message: "Carousel image deleted successfully",
            CarouselImg: pageImg.CarouselImg
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

