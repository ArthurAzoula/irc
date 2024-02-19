const express = require('express');

const authController = require('../controller/auth.controller');

const router = express.Router();

// POST /auth/login
router.post('/login', authController.login);

router.post('/register', authController.register);

// GET /auth/logout

router.get('/logout', authController.logout);

// GET /auth/me

router.get('/me', authController.getUserConnected);

module.exports = router;