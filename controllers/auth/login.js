const User = require('./../../models/User');
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
    let accessToken = '';
    let refreshToken = '';
    if(
        validatedUsername === false
    ){
        return res.status(400).json({message: 'invalid username'});
    }
    if(
        validatedPassword === false
    ){
        return res.status(400).json({message: 'invalid password'});
    }
    findUser = await User.findOne({username}, 'username password role').lean().exec();
    if(
        findUser === null
    ){
        return res.status(400).json({message: 'invalid username or password'});
    }
    bcrypt.compare(password, findUser.password, function(err, result) {
        if(
            err
        ){
            return res.status(400).json({message: 'login error'});
        }
        if(
            result === false
        ){
            return res.status(400).json({message: 'invalid username or password'});
        }
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
        return res.status(200).json({accessToken});
    });
}
module.exports = login;