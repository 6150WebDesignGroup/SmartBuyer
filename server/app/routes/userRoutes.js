const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/RegUser', userController.registerUser);
router.post('/Login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/editUser', userController.editUser);

module.exports = router;
