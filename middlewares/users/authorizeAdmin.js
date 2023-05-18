const { userFindOne } = require('./../../models/users/userQueries');
const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../functions/validation');
const authorizeAdmin = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = null;
    let decoded = null;
    let response = null;
    let findUser = null;
    if(
        validatedBearerToken === false
    ){
        response = {
            status: 400,
            message: 'invalid bearer token'
        }
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
            }
        }else if(
            decoded.role !== 'Admin'
        ){
            response = {
                status: 403,
                message: 'unauthorized'
            }
        }else{
            return next();
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = authorizeAdmin;