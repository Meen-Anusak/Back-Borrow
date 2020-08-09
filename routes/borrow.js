const express = require('express');
const router = express.Router();
const borrow_controller = require('../controllers/borrow_controller');
const token = require('../configs/passport_JWT');

router.get('/item', borrow_controller.getItem);


router.post('/', [token.isLogin], borrow_controller.addItem);

router.get('/', [token.isLogin], borrow_controller.getItemByUser);

router.post('/removeItem', [token.isLogin], borrow_controller.RemoveItem);

router.post('/deleteItem', [token.isLogin], borrow_controller.DeleteItem);
router.post('/deleteList',[token.isLogin],borrow_controller.DeleteList);


module.exports = router;