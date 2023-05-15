const Order = require('../models/order');
const User = require('../models/users');
const router = require('express').Router();
const {
    generateToken,
    getTokenFromHeaders,
    verifyToken,
} = require('../utils/tokenManagement');

router.post('/create', async (req, res) => {
    const token = getTokenFromHeaders(req);
    if (!token) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    const user = verifyToken(token);
    if (!user) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }

    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        user: user.id,
    });

    try {
        //Create Order
        const order = await newOrder.save();
        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/fetch-order/:id', async (req, res) => {
    const token = getTokenFromHeaders(req);
    if (!token) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    const user = verifyToken(token);
    if (!user) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    const id = req.params.id;

    try {
        //Create Order
        const order = await Order.findById(id);
        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', async (req, res) => {
    const token = getTokenFromHeaders(req);
    if (!token) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    const user = verifyToken(token);
    if (!user) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    try {
        //Fetch Orders
        const orders = await Order.find();
        res.status(201).json({ orders });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/fetch-orders', async (req, res) => {
    const token = getTokenFromHeaders(req);
    if (!token) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    const user = verifyToken(token);
    if (!user) {
        return res
            .status(400)
            .json({ msg: 'User Not Authenticated, Please Sign In' });
    }
    try {
        //Fetch Orders
        const orders = await Order.find({ user: user.id });
        res.status(201).json({ orders });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }
        const user = verifyToken(token);
        if (!user) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        const order = await Order.findById(req.params.id);

        if (req.body.isPaid) {
            order.isPaid = req.body.isPaid;
        }
        if (req.body.isDelivered) {
            order.isDelivered = req.body.isDelivered;
        }

        await order.save();
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/pay/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order Not Found' });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResults = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await Order.save();
        res.status(201).json({ updatedOrder });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }
        const user = verifyToken(token);
        if (!user) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        await Order.findByIdAndDelete(id);

        res.status(201).json({
            msg: 'Order deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
