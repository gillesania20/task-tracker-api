const { userFindOne } = require('./../../models/users/userQueries');
const { taskFindOne, taskUpdateOne } = require('./../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const {
    validateId,
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody,
    validateTaskCompleted
} = require('./../../functions/validation');
const updateTask = async (req, res) => {
    const bearerToken = req.headers.authorization;
    const id = req.params.id;
    const title = req.body.title;
    const body = req.body.body;
    const completed = req.body.completed;
    const validatedBearerToken = validateBearerToken(bearerToken);
    const validatedId = validateId(id);
    const validatedTitle = validateTaskTitle(title);
    const validatedBody = validateTaskBody(body);
    const validatedCompleted = validateTaskCompleted(completed);
    let findUser = null;
    let findTask = null;
    let accessToken = '';
    let decoded = null;
    let update = null;
    let response = null;
    if(
        validatedBearerToken === false
    ){
        response = {
            status: 400,
            message: 'invalid bearer token'
        };
    }else if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid task id'
        };
    }else if(
        typeof title !== 'undefined' && validatedTitle === false
    ){
        response = {
            status: 400,
            message: 'invalid task title'
        };
    }else if(
        typeof body !== 'undefined' && validatedBody === false
    ){
        response = {
            status: 400,
            message: 'invalid task body'
        };
    }else if(
        typeof completed !== 'undefined' && validatedCompleted === false
    ){
        response = {
            status: 400,
            message: 'invalid task completed'
        };
    }else{
        accessToken = bearerToken.split(' ')[1];
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
        findUser = await userFindOne({username: decoded.username}, '_id');
        if(
            findUser === null
        ){
            response = {
                status: 404,
                message: 'user not found'
            };
        }else{
            findTask = await taskFindOne({_id: id},
                '_id title body completed completedAt');
            if(
                findTask === null
            ){
                response = {
                    status: 404,
                    message: 'task not found'
                };
            }else if(
                decoded.role === 'Admin'
            ){
                update = {};
                if(typeof title !== 'undefined'){
                    update.title = title;
                }
                if(typeof body !== 'undefined'){
                    update.body = body;
                }
                if(typeof completed !== 'undefined'){
                    update.completed = completed;
                    if(findTask.completed === false && completed === true){
                        update.completedAt = Date.now();
                    }
                }
                await taskUpdateOne({ _id: findTask._id.toString()}, update);
                response = {
                    status: 200,
                    message: 'task updated'
                };
            }else if(
                decoded.role === 'User'
            ){
                update = {};
                if(typeof title !== 'undefined'){
                    update.title = title;
                }
                if(typeof body !== 'undefined'){
                    update.body = body;
                }
                if(typeof completed !== 'undefined'){
                    update.completed = completed;
                    if(findTask.completed === false && completed === true){
                        update.completedAt = Date.now();
                    }
                }
                await taskUpdateOne({ _id: findTask._id.toString()}, update);
                response = {
                    status: 200,
                    message: 'task updated'
                };
            }else{
                response = {
                    status: 403,
                    message: 'unauthorized'
                };
            }
        }
    }
    return res.status(response.status).json({
        message: response.message
    });
}
module.exports = updateTask;