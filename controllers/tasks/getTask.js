const User = require('./../../models/User');
const Task = require('./../../models/Task');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../functions/validation');
const getTask = (req, res) => {
    const id = req.params.id;
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTask = null;
    if(
        validatedId === false
    ){
        return res.json({message: 'invalid id'});
    }
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
        findUser = await User.findOne({username: decoded.username}, '_id').lean().exec();
        if(
            findUser === null
        ){
            return res.json({message: 'user not found'});
        }
        if(
            decoded.role === 'Admin'
        ){
            findTask = await Task.findOne({_id: id}, '-_id user title body completed completedAt')
                .populate('user', 'username -_id').lean().exec();
            if(
                findTask === null
            ){
                return res.json({message: 'task not found'});
            }
            return res.json(findTask);
        }else if(
            decoded.role === 'User'
        ){
            findTask = await Task.findOne({_id: id, user: findUser._id}, '-_id user title body completed completedAt')
                .populate('user', 'username').lean().exec();
            if(
                findTask === null
            ){
                return res.json({message: 'task not found'});
            }
            return res.json(findTask);
        }else{
            return res.json({message: 'unauthorized'});
        }
    });
}
module.exports = getTask;