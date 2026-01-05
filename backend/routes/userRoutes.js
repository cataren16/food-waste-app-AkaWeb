const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getProfile);

router.put('/update/:id', userController.updateUser);

module.exports = router;