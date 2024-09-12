const express = require('express'); 

const router = express.Router(); 

const bcrypt = require('bcryptjs'); 

const jwt = require('jsonwebtoken'); 

const User = require('../Model/user'); 

router.post('/login', async (req, res) => { 

    const { username,usertype, password } = req.body; 

    try { 

        const user = await User.findOne({ username }); 

        if (!user) { 

            return res.status(400).json({ message: 'Invalid username or password' }); 

        } 

    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) { 

        return res.status(400).json({ message: 'Invalid username or password' }); 

    } 

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' }); 

    res.json({ token }); 

    } catch (error) { 

    console.error(error); 

    res.status(500).send('Server Error'); 

    } 

}); 

module.exports = router;