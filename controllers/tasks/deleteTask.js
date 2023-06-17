const { userFindOne } = require('./../../models/users/userQueries');
const { taskFindOne, taskDeleteOne} = require('./../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../functions/validation');
const deleteTask = async (req, res) => {
    const bearerToken = req.headers.authorization;
    const id = req.params.id;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTask = null;
    let decoded = null;
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
        }else if(
            decoded.role === 'Admin'
            || decoded.role === 'User'
        ){
            if(decoded.role === 'Admin'){
                findTask = await taskFindOne({_id: id}, '_id');
            }else if(decoded.role === 'User'){
                findTask = await taskFindOne({_id: id, user: findUser._id.toString()}, '_id');
            }
            if(
                findTask === null
            ){
                response = {
                    status: 404,
                    message: 'task not found'
                };
            }else{
                await taskDeleteOne({_id: findTask._id.toString()});
                response = {
                    status: 200,
                    message: 'task deleted'
                };
            }
        }else{
            response = {
                status: 403,
                message: 'unauthorized'
            };
        }
    }
    return res.status(response.status).json({
        message: response.message
    });
}
module.exports = deleteTask;