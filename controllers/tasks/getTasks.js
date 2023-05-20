const { userFindOne } = require('./../../models/users/userQueries');
const { taskFind } = require('./../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../functions/validation');
const getTasks = async (req, res) => {
    const bearerToken = req.headers.authorization;
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTasks = [];
    let decoded = null;
    let response = null;
    if(
        validatedBearerToken === false
    ){
        response = {
            status: 400,
            message: 'invalid bearer token',
            tasks: null
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
                tasks: null
            };
        }else if(
            decoded.role === 'Admin'
        ){
            findTasks = await taskFind({}
                ,'_id title body completed completedAt');
            if(
                findTasks.length <= 0
            ){
                response = {
                    status: 200,
                    message: 'no tasks yet',
                    tasks: []
                }
            }else{
                response = {
                    status: 200,
                    message: 'display tasks',
                    tasks: findTasks
                };
            }
        }else if(
            decoded.role === 'User'
        ){
            findTasks = await taskFind({user: findUser._id}
                ,'_id title body completed completedAt');
            if(
                findTasks.length <= 0
            ){
                response = {
                    status: 200,
                    message: 'no tasks yet',
                    tasks: []
                };
            }else{
                response = {
                    status: 200,
                    message: 'display tasks',
                    tasks: findTasks
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
        message: response.message,
        tasks: response.tasks
    });
}
module.exports = getTasks;