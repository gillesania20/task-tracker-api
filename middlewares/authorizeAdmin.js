const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../functions/validation');
const authorizeAdmin = (req, res, next) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = {}
    if(
        validatedBearerToken === false
    ){
        return res.json({message: 'invalid bearer token'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function(err, decoded) {
        if(err){
            return res.json({message: 'failed token verification'});
        }
        if(
            decoded.role !== 'Admin'
        ){
            return res.json({message: 'unauthorized'});
        }
        next();
    });
}
module.exports = authorizeAdmin;