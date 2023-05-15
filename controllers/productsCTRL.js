require('dotenv').config();
const express = require('express');
const Product = require('../models/product');

const {
    getTokenFromHeaders,
    verifyToken,
} = require('../utils/tokenManagement');

const router = express.Router();

//Fetch All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        //res.send(products);
        res.status(201).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Fetch On producto by slug
router.get('/slug/:slug', async (req, res) => {
    //const product = data.products.find((p) => p.slug === req.params.slug);
    const slug = req.params.slug;
    try {
        const product = await Product.findOne({ slug });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ message: 'Product Not Founnd' });
    }
});

//Fetch On producto by id
router.get('/:id', async (req, res) => {
    //const product = data.products.find((p) => p._id === req.params.id);
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ message: 'Product Not Founnd' });
    }
});

router.post('/save', async (req, res) => {
    const { name, slug, category, price, countInStock, description } = req.body;
    console.log(req.name);
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Image required' });
        }

        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }
        const user = verifyToken(token);
        if (!user.isAdmin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const product = await Product.create({
            name,
            slug,
            category,
            images: req.file.path,
            price,
            countInStock,
            description,
        });
        res.status(201).json({ msg: 'Product Created Successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update Product
router.put('/update/:id', async (req, res) => {
    const { name, slug, category, price, countInStock, description } = req.body;
    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }
        const user = verifyToken(token);
        if (!user.isAdmin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const product = await Product.findById(req.params.id);

        product.name = name;
        product.price = price;
        product.slug = slug;
        product.countInStock = countInStock;
        product.category = category;
        product.description = description;
        if (req.file) {
            product.images = req.file.path;
        }
        await product.save();

        res.status(201).json({ msg: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

//DeleteProduct
router.delete('/delete/:id', async (req, res) => {
    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        const user = verifyToken(token);
        if (!user.isAdmin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(201).json({ msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
