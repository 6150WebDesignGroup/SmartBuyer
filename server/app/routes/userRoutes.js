const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const paymentController = require("../controllers/paymentController");

router.post('/RegUser', userController.registerUser);
router.post('/Login', userController.loginUser);
router.post('/Logout', userController.logoutUser);
router.post('/editUser', userController.editUser);

// add paymentMethod


router.post("/payment/add", paymentController.addPaymentMethod);

router.post("/payment/delete", paymentController.deletePaymentMethod);

router.post("/payment/edit", paymentController.editPaymentMethod);

router.post("/payment/getByUserEmail",paymentController.getpaymentMethod);

///

module.exports = router;
