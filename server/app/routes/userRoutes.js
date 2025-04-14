const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const paymentController = require("../controllers/paymentController");

router.post('/RegUser', userController.registerUser);
router.post('/Login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/editUser', userController.editUser);

// add paymentMethod


module.exports = router;
router.post("/payment/add", payMethodController.addPaymentMethod);

router.post("/payment/delete", payMethodController.deletePaymentMethod);

router.post("/payment/edit", payMethodController.editPaymentMethod);
