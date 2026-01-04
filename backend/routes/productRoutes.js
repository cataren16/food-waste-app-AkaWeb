const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/add', productController.uploadImage, productController.addProduct);
router.get('/user/:id_utilizator', productController.getUserProducts);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;