const router = require('express').Router();

const usersCTRL = require('../controllers/usersCTRL');

router.post('/register', usersCTRL);
router.get('/profile', usersCTRL);
router.get('/fetch-user/:id', usersCTRL);
router.get('/fetch-users', usersCTRL);
router.put('/update', usersCTRL);
router.put('/update/:id', usersCTRL);
router.post('/login', usersCTRL);
router.delete('/delete/:id', usersCTRL);

module.exports = router;
