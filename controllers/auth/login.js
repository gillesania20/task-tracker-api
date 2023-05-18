const { userFindOne } = require('./../../models/users/userQueries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateUsername, validatePassword } = require('./../../functions/validation');
const {
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
    COOKIE_MAX_AGE,
    COOKIE_HTTP_ONLY,
    COOKIE_SAME_SITE,
    COOKIE_SECURE
} = require('./../../constants');
const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const validatedUsername = validateUsername(username);
    const validatedPassword = validatePassword(password);
    let findUser = null;
    let comparePassword = false;
    let accessToken = '';
    let refreshToken = '';
    let response = null;
    if(
        validatedUsername === false
    ){
        response = {
            status: 400,
            message: 'invalid username',
            accessToken: null
        }
    }else if(
        validatedPassword === false
    ){
        response = {
            status: 400,
            message: 'invalid password',
            accessToken: null
        }
    }else{
        findUser = await userFindOne({username}, 'username password role');
        if(
            findUser === null
        ){
            response = {
                status: 400,
                message: 'invalid username or password',
                accessToken: null
            }
        }else{
            comparePassword = await bcrypt.compare(password, findUser.password);
            if(
                comparePassword === false
            ){
                response = {
                    status: 400,
                    message: 'invalid username or password',
                    accessToken: null
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
                refreshToken = jwt.sign(
                    {
                        username: findUser.username
                    },
                    process.env.REFRESH_TOKEN,
                    {
                        expiresIn: REFRESH_TOKEN_EXPIRES_IN
                    }
                );
                res.cookie(
                    'jwt',
                    refreshToken,
                    {
                        maxAge: COOKIE_MAX_AGE,
                        httpOnly: COOKIE_HTTP_ONLY,
                        sameSite: COOKIE_SAME_SITE,
                        secure: COOKIE_SECURE
                    }
                )
                response = {status: 200, message: 'successful login', accessToken}
            }
        }
    }
    return res.status(response.status).json({
        message: response.message,
        accessToken: response.accessToken
    });
}
module.exports = login;