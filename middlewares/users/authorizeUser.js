const { userFindOne } = require('./../../models/users/userQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../functions/validation');
const authorizedUser = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const id = req.params.id;
    const validatedId = validateId(id);
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = '';
    let findUser = null;
    let response = null;
    let decoded = null;
    if(
        validatedBearerToken === false 
    ){
        response = {
            status: 400,
            message: 'unauthorized'
        };
    }else if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid id'
        };
    }else{
        accessToken = bearerToken.split(' ')[1];
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
        findUser = await userFindOne({username: decoded.username}, '_id');
        if(findUser === null){
            response = {
                status: 404,
                message: 'user not found'
            };
        }else if(decoded.role === 'Admin'){
            return next();
        }else if(decoded.role === 'User'){
            if(findUser._id.toString() !== id){
                response = {
                    status: 400,
                    message: 'unauthorized'
                };
            }else{
                return next();
            }
        }else{
            response = {
                status: 403,
                message: 'unauthorized'
            };
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = authorizedUser;