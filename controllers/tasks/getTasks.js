const User = require('./../../models/User');
const Task = require('./../../models/Task');
const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../functions/validation');
const getTasks = (req, res) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTasks = [];
    if(
        validatedBearerToken === false
    ){
        return res.json({message: 'invalid bearer token'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async function(err, decoded){
        if(err){
            return res.json({message: 'access token verification failed'});
        }
        if(
            decoded.role === 'Admin'
        ){
            findTasks = await Task.find({}, '_id user title body completed completedAt')
                .populate('user', 'username -_id').lean().exec();
            if(
                findTasks.length <= 0
            ){
                return res.json({message: 'no tasks yet'});
            }else{
                return res.json(findTasks);
            }
        }else if(
            decoded.role === 'User'
        ){
            findUser = await User.findOne({username: decoded.username}, '_id').lean().exec();
            if(
                findUser === null
            ){
                return res.json({message: 'user not found'});
            }
            findTasks = await Task.find({user: findUser._id}, '_id user title body completed completedAt')
                .populate('user', 'username').lean().exec();
            if(
                findTasks.length <= 0
            ){
                return res.json({message: 'no tasks yet'});
            }
            return res.json(findTasks);
        }else{
            return res.json({message: 'invalid access token'});
        }
    });
}
module.exports = getTasks;