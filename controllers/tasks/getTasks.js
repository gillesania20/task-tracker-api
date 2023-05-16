const User = require('./../../models/user/User');
const Task = require('./../../models/task/Task');
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
        return res.status(400).json({message: 'invalid bearer token'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async function(err, decoded){
        if(err){
            return res.status(400).json({message: 'access token verification failed'});
        }
        if(
            decoded.role === 'Admin'
        ){
            findTasks = await Task.find({}, '_id user title body completed completedAt')
                .populate('user', 'username -_id').lean().exec();
            if(
                findTasks.length <= 0
            ){
                return res.status(200).json({message: 'no tasks yet'});
            }else{
                return res.status(200).json(findTasks);
            }
        }else if(
            decoded.role === 'User'
        ){
            findUser = await User.findOne({username: decoded.username}, '_id').lean().exec();
            if(
                findUser === null
            ){
                return res.status(404).json({message: 'user not found'});
            }
            findTasks = await Task.find({user: findUser._id}, '_id user title body completed completedAt')
                .populate('user', 'username').lean().exec();
            if(
                findTasks.length <= 0
            ){
                return res.status(200).json({message: 'no tasks yet'});
            }
            return res.status(200).json(findTasks);
        }else{
            return res.status(403).json({message: 'unauthorized'});
        }
    });
}
module.exports = getTasks;