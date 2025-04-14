const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "imgs/Product");
    },
    filename: function (req, file, cb) {
        const filename = "ProductImg-" + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG/PNG/GIF files are allowed."));
    }
};

module.exports = multer({ storage, fileFilter });
