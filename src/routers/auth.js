const express = require('express');
const router = express.Router();
const { register, login, logout, requireLogin } = require('../controllers/auth');
const { userValidationRules, validate } = require('../helper/signUpValidator');

router.post('/register', userValidationRules(), validate, register);
router.post('/login', login);
router.get('/logout', requireLogin, logout);

module.exports = router