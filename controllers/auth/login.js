const User = require('./../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateUsername, validatePassword } = require('./../../functions/validation');
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
        return res.json({message: 'invalid username'});
    }
    if(
        validatedPassword === false
    ){
        return res.json({message: 'invalid password'});
    }
    findUser = await User.findOne({username}, 'username password role').lean().exec();
    if(
        findUser === null
    ){
        return res.json({message: 'invalid username or password'});
    }
    bcrypt.compare(password, findUser.password, function(err, result) {
        if(
            err
        ){
            return res.json({message: 'login error'});
        }
        if(
            result === false
        ){
            return res.json({message: 'invalid username or password'});
        }
        accessToken = jwt.sign(
            {
                username: findUser.username,
                role: findUser.role
            },
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '15s'
            }
        );
        refreshToken = jwt.sign(
            {
                username: findUser.username
            },
            process.env.REFRESH_TOKEN,
            {
                expiresIn: '1d'
            }
        );
        res.cookie(
            'jwt',
            refreshToken,
            {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                //sameSite: 'none',
                //secure: false
            }
        )
        return res.json({accessToken});
    });
}
module.exports = login;