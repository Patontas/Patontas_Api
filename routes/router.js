const router = require('express').Router();

const productsRoutes = require('./productsRoutes');
const usersRoutes = require('./usersRoutes');
const orderRoutes = require('./ordersRoutes');

router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
