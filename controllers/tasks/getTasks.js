const { userFindOne } = require('./../../models/users/userQueries');
const { taskFindAndPopulate } = require('./../../models/tasks/taskQueries');
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
            tasks: []
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
                tasks: []
            };
        }else if(
            decoded.role === 'Admin'
            || decoded.role === 'User'
        ){
            if(decoded.role === 'Admin'){
                findTasks = await taskFindAndPopulate({}
                    ,'_id title body completed completedAt');
            }else if(decoded.role === 'User'){
                findTasks = await taskFindAndPopulate(
                    {user: findUser._id.toString()}
                    ,'_id title body completed completedAt');
            }
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
        }else{
            response = {
                status: 403,
                message: 'unauthorized',
                tasks: []
            };
        }
    }
    return res.status(response.status).json({
        message: response.message,
        tasks: response.tasks
    });
}
module.exports = getTasks;