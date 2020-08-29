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

router.post('/borrow',[token.isLogin],borrow_controller.borrow);

router.get('/wait-borrow',[token.isLogin],borrow_controller.waitBorrow);

router.get('/allow',borrow_controller.getwaitBorrow);

router.post('/allow',borrow_controller.Allow);

router.get('/returnItem',[token.isLogin],borrow_controller.getReturnItemByUser);

router.get('/showItem-byUser/:id',[token.isLogin],borrow_controller.showItemByUser);

router.get('/returnBorrow',borrow_controller.getReturnBorrow);

router.post('/returnTostore',borrow_controller.returnTostore);

router.get('/productReturn',borrow_controller.getProductReturn);

router.get('/productReturnByuser',[token.isLogin],borrow_controller.getProductReturnByUser);

module.exports = router;