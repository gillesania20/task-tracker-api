const User = require('./../../models/User');
const Task = require('./../../models/Task');
const jwt = require('jsonwebtoken');
const {
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody
} = require('./../../functions/validation');
const addTask = async (req, res) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const title = req.body.title;
    const body = req.body.body;
    const validatedBearerToken = validateBearerToken(bearerToken);
    const validatedTitle = validateTaskTitle(title);
    const validatedBody = validateTaskBody(body);
    let pattern = '';
    let regex = null;
    let findTask = null;
    let findUser = null;
    if(
        validatedBearerToken === false
    ){
        return res.json({message: 'invalid bearer token'});
    }
    if(
        validatedTitle === false
    ){
        return res.json({message: 'invalid task title'});
    }
    if(
        validatedBody === false
    ){
        return res.json({message: 'invalid task body'});
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
        pattern = `^${title}\$`;
        regex = new RegExp(pattern, "i");
        findTask = await Task.findOne(
            {
                title: {$regex: regex},
                user: findUser._id
            },
            '_id'
        ).lean().exec();
        if(
            findTask !== null
        ){
            return res.json({message: 'title already taken'});
        }
        await Task.create({
            title,
            body,
            user: findUser._id
        });
        return res.json({message: 'task added'});
    });
}
module.exports = addTask;