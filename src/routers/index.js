const express = require('express');
const router = express.Router();

// import individual routes
const authRoutes = require('./auth');
const roleRoutes = require('./role');
const userRoutes = require('./users');
const exceptionRoutes = require('./exception');

router.use('/auth', authRoutes);
router.use('/api', roleRoutes);
router.use('/api', userRoutes);


//alway use it below */
router.use('', exceptionRoutes); // Handle exception and static files routing like(404,initpage,...)

module.exports = router