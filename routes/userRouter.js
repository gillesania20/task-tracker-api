const express = require('express');
const router = express.Router();
const getUsers = require('./../controllers/users/getUsers');
const getUser = require('./../controllers/users/getUser');
const addUser = require('./../controllers/users/addUser');
const updateUser = require('./../controllers/users/updateUser');
const deleteUser = require('./../controllers/users/deleteUser');
const authorizeUser = require('./../middlewares/authorizeUser');
router.route('/')
    .get(getUsers)
    .post(addUser);
router.route('/:id')
    .all(authorizeUser)
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)
module.exports = router;