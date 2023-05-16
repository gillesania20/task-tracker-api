const User = require('./../../models/user/User');
const Task = require('./../../models/task/Task');
const jwt = require('jsonwebtoken');
const {
    validateId,
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody,
    validateTaskCompleted
} = require('./../../functions/validation');
const updateTask = (req, res) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
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
    let origTask = {};
    let accessToken = '';
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
    if(
        validatedTitle === false
    ){
        return res.status(400).json({message: 'invalid task title'});
    }
    if(
        validatedBody === false
    ){
        return res.status(400).json({message: 'invalid task body'});
    }
    if(
        validatedCompleted === false
    ){
        return res.status(400).json({message: 'invalid task completed'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async function(err, decoded){
        if(err){
            return res.status(400).json({message: 'access token verification failed'});
        }
        findUser = await User.findOne({username: decoded.username}, '_id').lean().exec();
        if(
            findUser === null
        ){
            return res.status(404).json({message: 'user not found'});
        }
        if(
            decoded.role === 'Admin'
        ){
            findTask = await Task.findOne({_id: id}, 'id title body completed completedAt')
                .exec();
            if(
                findTask === null
            ){
                return res.status(404).json({message: 'task not find'});
            }else{
                origTask.title = findTask.title;
                origTask.body = findTask.body;
                origTask.completed = findTask.completed;
            }
            if(
                findTask.title !== title
            ){
                findTask.title = title;
            }
            if(
                findTask.body !== body
            ){
                findTask.body = body;
            }
            if(
                findTask.completed !== completed
            ){
                if(
                    findTask.completed === false
                    && completed === true
                ){
                    findTask.completed = true;
                    findTask.completedAt = Date.now();
                }else{
                    findTask.completed = completed;
                }
            }
            if(
                origTask.title !== findTask.title
                || origTask.body !== findTask.body
                || origTask.completed !== findTask.completed
            ){
                await findTask.save();
            }
            return res.status(200).json({message: 'task updated'});
        }else if(
            decoded.role === 'User'
        ){
            findTask = await Task.findOne(
                {_id: id, user: findUser._id},
                'id user title body completed completedAt'
            ).exec();
            if(
                findTask === null
            ){
                return res.status(404).json({message: 'task not found'});
            }else{
                origTask.title = findTask.title;
                origTask.body = findTask.body;
                origTask.completed = findTask.completed;
            }
            if(
                findTask.title !== title
            ){
                findTask.title = title;
            }
            if(
                findTask.body !== body
            ){
                findTask.body = body;
            }
            if(
                findTask.completed !== completed
            ){
                if(
                    findTask.completed === false
                    && completed === true
                ){
                    findTask.completed = completed;
                    findTask.completedAt = Date.now();
                }else{
                    findTask.completed = completed;
                }
            }
            if(
                origTask.title !== findTask.title
                || origTask.body !== findTask.body
                || origTask.completed !== findTask.completed
            ){
                await findTask.save();
            }
            return res.status(200).json({message: 'task updated'});
        }else{
            return res.status(403).json({message: 'unauthorized'});
        }
    });
}
module.exports = updateTask;