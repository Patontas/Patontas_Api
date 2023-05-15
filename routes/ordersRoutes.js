const router = require('express').Router();

const orderCTRL = require('../controllers/ordersCTRL');

router.post('/create', orderCTRL);
router.get('/fetch-order/:id', orderCTRL);
router.put('/pay/:id', orderCTRL);
router.put('/update/:id', orderCTRL);
router.get('/fetch-orders', orderCTRL);
router.get('/', orderCTRL);
router.delete('/delete/:id', orderCTRL);

module.exports = router;
