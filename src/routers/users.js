const express = require('express');
const router = express.Router();
const { requireLogin, isAdmin, isAuth } = require('../controllers/auth');
const { userById, read, update, userList, remove } = require('../controllers/user');

router.get('/users', requireLogin, isAdmin, userList);
router.get("/user/:userId", requireLogin, isAuth, read);
router.put("/user/:userId", requireLogin, isAuth, update);
router.get("/user/:userId/reset-password", requireLogin, isAdmin, update);
router.delete("/user/:userId", requireLogin, isAuth, remove);

router.param("userId", userById);

module.exports = router;