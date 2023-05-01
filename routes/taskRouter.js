const express = require('express');
const router = express.Router();
const getTasks = require('./../controllers/tasks/getTasks');
const getTask = require('./../controllers/tasks/getTask');
const addTask = require('./../controllers/tasks/addTask');
const updateTask = require('./../controllers/tasks/updateTask');
const deleteTask = require('./../controllers/tasks/deleteTask');
router.route('/')
    .get(getTasks)
    .post(addTask);
router.route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask);
module.exports = router;