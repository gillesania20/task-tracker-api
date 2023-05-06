const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../functions/validation');
const authorizedUser = (req, res, next) => {
    const bearerToken = req.headers.authorization || req.headers.authorization;
    const id = req.params.id;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    if(
        validatedBearerToken === false 
    ){
        return res.json({message: 'unauthorized'});
    }
    if(
        validatedId === false
    ){
        return res.json({message: 'invalid id'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async function(err, decoded){
        if(err){
            return res.json({message: 'failed token verification'});
        }
        if(decoded.role === 'Admin'){
            next();
        }else if(decoded.role === 'User'){
            findUser = await User.findOne({username: decoded.username}, '_id').lean().exec();
            if(findUser === null){
                return res.json({message: 'user not found'});
            }
            if(findUser._id.toString() !== id){
                return res.json({message: 'unauthorized'})
            }
            next();
        }else{
            return res.json({message: 'unauthorized'})
        }
    });
}
module.exports = authorizedUser;