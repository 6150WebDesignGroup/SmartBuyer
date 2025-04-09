const express = require('express');
const Admin = require('../model/User');
const PageSetup = require('../model/PageSetup');
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();

// multer fun
// search from Internet
const storage = multer.diskStorage({
    destination: function (req,file, cb) {
        cb(null, "imgs");
    },
    filename: function (req,file, cb) {
        const filename = "backgroundImg-"+file.originalname;
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
 * this routes is using for admin manage imgs && products
 */

/**
 * background img setUp
 */

router.post("/uploadBackgroundImg",upload.single("imgFile"),async (req,res)=>{
    try{
        let pageImg = await PageSetup.findOne();
        if(!pageImg){
            pageImg = new PageSetup({
                BackgroundImg: [],
                Title: "",
                Description: "",
                CarouselImg: [],
                lastUpdated: new Date()
            });
        }
        const filePath  = '../../imgs/background'+req.file.filename;
        pageImg.BackgroundImg = filePath;
        await pageImg.save();


    }catch (err){
        if(err.message === "Only JPEG/PNG/GIF files are allowed."){
            return res.status(400).json({
                error:"Only JPEG/PNG/GIF files are allowed."
            });
        }
        return res.status(500).json({
            Message:"server error"
        });
    }

})



/**
 * CarouselImg setUp  每次上传单张图片就好
 */
router.post("/uploadCarouseImg",upload.single("imgFile"),async (req,res)=>{
    try{
        let pageImg = await PageSetup.findOne();
        if(!pageImg){
            pageImg = new PageSetup({
                BackgroundImg: [],
                Title: "",
                Description: "",
                CarouselImg: [],
                lastUpdated: new Date()
            });
        }
        const filePath  = '../../imgs/Carouse'+req.file.filename;
        pageImg.CarouselImg.push(filePath);
        pageImg.lastUpdated = new Date();
        await pageImg.save();

        return res.status(200).json({
            message: "Image uploaded and added to Carousel successfully",
            imagePath: filePath,
            CarouselImg: pageImg.CarouselImg
        });


    }catch (err){
        if(err.message === "Only JPEG/PNG/GIF files are allowed."){
            return res.status(400).json({
                error:"Only JPEG/PNG/GIF files are allowed."
            });
        }
        return res.status(500).json({
            Message:"server error"
        });
    }

})

/**
 * CarouseImg delete
 */

router.post("/editCarouseImg",upload.single("imgFile"),async (req,res)=>{
    try{
        const deleteCarouseImg = req.body.deletImg;
        const pageImg = await PageSetup.findOne();
        pageImg.CarouselImg = pageImg.CarouselImg.filter(imgPath => imgPath !== deleteCarouseImg);

        pageImg.lastUpdated = new Date();

        await pageImg.save();

    }catch (err){
        if(err.message === "Only JPEG/PNG/GIF files are allowed."){
            return res.status(400).json({
                error:"Only JPEG/PNG/GIF files are allowed."
            });
        }
        return res.status(500).json({
            Message:"server error"
        });
    }

})









module.exports = router;