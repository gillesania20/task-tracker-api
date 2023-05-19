const { userFindOne } = require('./../../models/users/userQueries');
const { taskFindOne, taskCreate } = require('./../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const {
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody
} = require('./../../functions/validation');
const addTask = async (req, res) => {
    const bearerToken = req.headers.authorization;
    const title = req.body.title;
    const body = req.body.body;
    const validatedBearerToken = validateBearerToken(bearerToken);
    const validatedTitle = validateTaskTitle(title);
    const validatedBody = validateTaskBody(body);
    let pattern = '';
    let regex = null;
    let findTask = null;
    let findUser = null;
    let decoded = null;
    let response = null;
    if(
        validatedBearerToken === false
    ){
        response = {
            status: 400,
            message: 'invalid bearer tokne'
        };
    }else if(
        validatedTitle === false
    ){
        response = {
            status: 400,
            message: 'invalid task title'
        };
    }else if(
        validatedBody === false
    ){
        response = {
            status: 400,
            message: 'invalid task body'
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
            pattern = `^${title}\$`;
            regex = new RegExp(pattern, "i");
            findTask = await taskFindOne(
                {
                    title: {$regex: regex},
                    user: findUser._id
                },
                '_id'
            );
            if(
                findTask !== null
            ){
                response = {
                    status: 400,
                    message: 'title already taken'
                };
            }else{
                await taskCreate({
                    title,
                    body,
                    user: findUser._id
                });
                response = {
                    status: 201,
                    message: 'task added'
                };
            }
        }
    }
    return res.status(response.status).json({
        message: response.message
    });
}
module.exports = addTask;