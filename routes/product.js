const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product_controller');
const multer = require('multer');
const token = require('../configs/passport_JWT');
const multerConfig = require('../configs/multer');
const upload = multer(multerConfig.configs_product).single(multerConfig.keyUploads)

router.get('/', product_controller.getProduct);

router.post('/', [token.isLogin], upload, product_controller.addProduct);

module.exports = router;