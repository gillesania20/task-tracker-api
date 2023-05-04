const express = require('express');
const router = express.Router();
const login = require('./../controllers/auth/login');
const refresh = require('./../controllers/auth/refresh');
router.route('/login')
    .post(login);
router.route('/refresh')
    .post(refresh);
module.exports = router;