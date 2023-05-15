const User = require('../models/users');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const {
    generateToken,
    getTokenFromHeaders,
    verifyToken,
} = require('../utils/tokenManagement');

router.post('/register', async (req, res) => {
    const { name, email, password, confirmPass } = req.body;
    if (!name || !email || !password || !confirmPass) {
        return res.status(400).json({ msg: 'All fields Are Required' });
    }
    if (password !== confirmPass) {
        return res.status(404).json({ msg: "Passwords don't match" });
    }
    try {
        // Check if user exists
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(404).json({ msg: 'User Already Exists' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Register User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Login
        const token = generateToken(
            user._id,
            user.email,
            user.name,
            user.isAdmin
        );

        res.status(201).json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/update', async (req, res) => {
    const { name, email, password, confirmPass, isAdmin } = req.body;
    if (!name || !email) {
        return res.status(400).json({ msg: 'Email And Name Are Required' });
    }

    if (password !== confirmPass) {
        return res.status(404).json({ msg: "Passwords don't match" });
    }

    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        const userLogged = verifyToken(token);
        if (!userLogged) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(isAdmin);

        //find User
        const user = await User.findById(userLogged.id);

        //Update User
        user.name = name;
        user.email = email;
        user.isAdmin = isAdmin;
        if (password) {
            user.password = hashedPassword;
        }

        await user.save();

        res.status(201).json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/update/:id', async (req, res) => {
    const { isAdmin } = req.body;
    const id = req.params.id;
    try {
        const token = getTokenFromHeaders(req);
        if (!token) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        const userLogged = verifyToken(token);
        if (!userLogged) {
            return res
                .status(400)
                .json({ msg: 'User Not Authenticated, Please Sign In' });
        }

        //find User
        const user = await User.findById(id);

        //Update User
        user.isAdmin = isAdmin;

        await user.save();

        res.status(201).json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/profile', async (req, res) => {
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

        //find User
        const userProfile = await User.findById(user.id);

        res.status(201).json({
            userProfile,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/fetch-user/:id', async (req, res) => {
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

        //find User
        const userDetails = await User.findById(id);

        res.status(201).json({
            userDetails,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/fetch-users', async (req, res) => {
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
        if (!user.isAdmin) {
            return res.status(400).json({ msg: 'Invalid User Credentials' });
        }

        //find User
        const users = await User.find();

        res.status(201).json({
            users,
        });
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

        await User.findByIdAndDelete(id);

        res.status(201).json({
            msg: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    //Validate Data
    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields Are Required' });
    }
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        //Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        // Login
        const token = generateToken(
            user._id,
            user.email,
            user.name,
            user.isAdmin
        );

        res.status(201).json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
