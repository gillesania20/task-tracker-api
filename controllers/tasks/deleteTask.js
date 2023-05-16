const User = require('./../../models/user/User');
const Task = require('./../../models/task/Task');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../functions/validation');
const deleteTask = (req, res) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const id = req.params.id;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let findTask = null;
    if(
        validatedBearerToken === false
    ){
        return res.status(400).json({message: 'invalid bearer token'});
    }
    if(
        validatedId === false
    ){
        return res.status(400).json({message: 'invalid task id'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async function(err, decoded){
        if(err){
            return res.status(400).json({message: 'access token verification failed'});
        }
        findUser = await User.findOne({username: decoded.username}, '_id')
            .lean().exec();
        if(
            findUser === null
        ){
            return res.status(404).json({message: 'user not found'});
        }
        if(
            decoded.role === 'Admin'
        ){
            findTask = await Task.findOne({_id: id})
                .lean().exec();
            if(
                findTask === null
            ){
                return res.status(404).json({message: 'task not found'});
            }
            await Task.deleteOne({_id: findTask._id});
            return res.status(200).json({message: 'task deleted'});
        }else if(
            decoded.role === 'User'
        ){
            findTask = await Task.findOne({_id: id, user: findUser._id}, '_id')
                .lean().exec();
            if(
                findTask === null
            ){
                return res.status(404).json({message: 'task not found'});
            }
            await Task.deleteOne({_id: findTask._id});
            return res.status(200).json({message: 'task deleted'});
        }else{
            return res.status(403).json({message: 'unauthorized'});
        }
    });
}
module.exports = deleteTask;