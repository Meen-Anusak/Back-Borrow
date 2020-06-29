const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

const multer = require('multer');
const token = require('../configs/passport_JWT');
const multerConfig = require('../configs/multer');
const upload = multer(multerConfig.configs_user).single(multerConfig.keyUploads)

/* GET users listing. */

router.post('/', upload, user_controller.addUser);

router.post('/login', user_controller.login);

router.get('/profile', [token.isLogin], user_controller.getProfile);

router.get('/', [token.isLogin], user_controller.getUsers);

router.delete('/:id', [token.isLogin], user_controller.deleteUser);

router.post('/change-pass', [token.isLogin], user_controller.changePass);

router.post('/update-image', [token.isLogin], upload, user_controller.updateImage);

router.get('/:id', [token.isLogin], user_controller.getUserById);

router.put('/:id', [token.isLogin], upload, user_controller.updateUser);


module.exports = router;