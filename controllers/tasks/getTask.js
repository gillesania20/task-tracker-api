const { userFindOne } = require('./../../models/users/userQueries');
const { taskFindOneAndPopulate } = require('./../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../functions/validation');
const getTask = async (req, res) => {
    const id = req.params.id;
    const bearerToken = req.headers.authorization;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTask = null;
    let decoded = null;
    let response = null;
    if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid id',
            task: null
        };
    }else if(
        validatedBearerToken === false
    ){
        response = {
            status: 400,
            message: 'invalid bearer token',
            task: null
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
                message: 'user not found',
                task: null
            };
        }else if(
            decoded.role === 'Admin'
        ){
            findTask = await taskFindOneAndPopulate({_id: id},
                '-_id title body completed completedAt');
            if(
                findTask === null
            ){
                response = {
                    status: 404,
                    message: 'task not found',
                    task: null
                };
            }else{
                response = {
                    status: 200,
                    message: 'display task',
                    task: findTask
                };
            }
        }else if(
            decoded.role === 'User'
        ){
            findTask = await taskFindOneAndPopulate({_id: id, user: findUser._id},
                    '-_id title body completed completedAt');
            if(
                findTask === null
            ){
                response = {
                    status: 404,
                    message: 'task not found',
                    task: null
                };
            }else{
                response = {
                    status: 200,
                    message: 'display task',
                    task: findTask
                };
            }
        }else{
            response = {
                status: 403,
                message: 'unauthorized',
                task: null
            };
        }
    }
    return res.status(response.status).json({
        message: response.message,
        task: response.task
    });
}
module.exports = getTask;