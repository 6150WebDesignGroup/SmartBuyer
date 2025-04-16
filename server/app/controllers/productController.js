const Product = require("../model/Product");


// search by name desc
exports.searchProduct = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 6 } = req.body;

        const searchRegex = new RegExp(keyword, 'i'); // 忽略大小写模糊匹配
        const filter = {
            $or: [
                { name: { $regex: searchRegex } },
                { cardDesc: { $regex: searchRegex } },
                { pageDesc: { $regex: searchRegex } }
            ]
        };

        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(filter);

        const productLists = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ name: 1 });

        return res.json({
            productLists,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Search Error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// sort by name price deliverytime

exports.getAllByCategory = async (req, res) => {
    try {
        const {
            categoryId,
            page = 1,
            limit = 6,
            sortBy = 'name' // 可为 name / price / time
        } = req.body;

        if (!categoryId) {
            return res.status(400).json({ error: "categoryId is required." });
        }

        const pageNum = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNum - 1) * pageSize;

        // 构建排序规则
        let sortField = {};
        switch (sortBy) {
            case 'price':
                sortField.price = 1;
                break;
            case 'time':
                sortField.deliveryTime = 1;
                break;
            default:
                sortField.name = 1;
        }

        const filter = { categoryId: Number(categoryId) };

        const total = await Product.countDocuments(filter);
        const productLists = await Product.find(filter)
            .skip(skip)
            .limit(pageSize)
            .sort(sortField);

        return res.json({
            productLists,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / pageSize),
            },
        });
    } catch (err) {
        console.error('getAllByCategory error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('getProductById error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

