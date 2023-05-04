const jwt = require('jsonwebtoken');
const User = require('./../../models/User');
const refresh = (req, res) => {
    const refreshToken = req.cookies.jwt;
    if(
        refreshToken === undefined
    ){
        return res.json({message: 'no refresh token'});
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async function(err, decoded){
        let findUser = null;
        let accessToken = '';
        if(
            err !== null
        ){
            return res.json({message: 'invalid refresh token'});
        }
        findUser = await User.findOne({username: decoded.username}, 'username role').lean().exec();
        if(
            findUser === null
        ){
            return res.json({message: 'user not found'});
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
        return res.json({accessToken});
    });
}
module.exports = refresh;