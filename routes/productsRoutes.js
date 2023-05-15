const router = require('express').Router();
const multer = require('multer');
const productsCTRL = require('../controllers/productsCTRL');
const storage = require('../config/cloudinary');

var upload = multer({ storage });

router.get('/', productsCTRL);
router.get('/slug/:slug', productsCTRL);
router.get('/:id', productsCTRL);
router.post('/save', upload.single('imagenProducto'), productsCTRL);
router.put('/update/:id', upload.single('imagenProducto'), productsCTRL);
router.delete('/delete/:id', productsCTRL);

module.exports = router;
