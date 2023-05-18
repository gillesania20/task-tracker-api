const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../functions/validation');
const authorizeAdmin = (req, res, next) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    const validatedBearerToken = validateBearerToken(bearerToken);
    let accessToken = {}
    if(
        validatedBearerToken === false
    ){
        return res.status(400).json({message: 'invalid bearer token'});
    }
    accessToken = bearerToken.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function(err, decoded) {
        if(err){
            return res.status(400).json({message: 'failed token verification'});
        }
        if(
            decoded.role !== 'Admin'
        ){
            return res.status(403).json({message: 'unauthorized'});
        }
        next();
    });
}
module.exports = authorizeAdmin;