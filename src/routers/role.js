const express = require('express');
const router = express.Router();
const { requireLogin, isAdmin } = require('../controllers/auth');
const { create, list, roleById, modify, remove } = require('../controllers/role');

router.post('/role', requireLogin, isAdmin, create);
router.get('/roles', requireLogin, isAdmin, list);
router.get('/role/:roleId', requireLogin, isAdmin, roleById);
router.put('/role/:roleId', requireLogin, isAdmin, modify);
router.delete('/role/:roleId', requireLogin, isAdmin, remove);

module.exports = router;