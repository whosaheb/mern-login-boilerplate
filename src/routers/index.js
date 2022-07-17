const express = require('express');
const router = express.Router();

// import individual routes
const authRoutes = require('./auth');
const roleRoutes = require('./role');
const userRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/api', roleRoutes);
router.use('/api', userRoutes);


router.get('/', (req, res)=>{
    res.send("bla!!!!")
});


module.exports = router