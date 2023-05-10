const express = require('express');
const router = express.Router();
const login = require('./../controllers/auth/login');
const refresh = require('./../controllers/auth/refresh');
const logout = require('./../controllers/auth/logout');
router.route('/login')
    .post(login);
router.route('/refresh')
    .post(refresh);
router.route('/logout')
    .post(logout);
module.exports = router;