const jwt = require('jsonwebtoken');
const { userFindOne } = require('./../../models/users/userQueries');
const { ACCESS_TOKEN_EXPIRES_IN } = require('./../../constants');
const refresh = async (req, res) => {
    const refreshToken = req.cookies.jwt;
    let decoded = null;
    let response = null;
    let findUser = null;
    let accessToken = '';
    if(
        refreshToken === undefined
    ){
        response = {
            status: 404,
            message: 'no refresh token',
            accessToken: null,
            userId: null
        }
    }else{
        decoded = jwt.verify(
            refreshToken, process.env.REFRESH_TOKEN
        );
        findUser = await userFindOne(
            {username: decoded.username}, '_id username role'
        );
        if(
            findUser === null
        ){
            response = {
                status: 404,
                message: 'user not found',
                accessToken: null,
                userId: null
            }
        }else{
            accessToken = jwt.sign(
                {
                    username: findUser.username,
                    role: findUser.role
                },
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: ACCESS_TOKEN_EXPIRES_IN
                }
            );
            response = {
                status: 200,
                message: 'successful token refresh',
                accessToken,
                userId: findUser._id.toString()
            };
        }
    }
    return res
        .status(response.status)
        .json({
            message: response.message,
            accessToken: response.accessToken,
            userId: response.userId
    });
}
module.exports = refresh;