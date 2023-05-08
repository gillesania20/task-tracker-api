const User = require('./../../models/User');
const bcrypt = require('bcrypt');
const { validateId, validateUsername, validatePassword } = require('./../../functions/validation');
const updateUser = async (req, res) => {
    const saltRounds = 10;
    const id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const validatedId = validateId(id);
    const validatedUsername = validateUsername(username);
    const validatedPassword = validatePassword(password);
    let user = null;
    if(
        validatedId === false
    ){
        return res.status(400).json({message: 'invalid id'});
    }
    if(
        validatedUsername === false
    ){
        return res.status(400).json({message: 'invalid username'});
    }
    if(
        password.length <= 0
    ){
        user = await User.findOne({_id: id}, 'username').exec();
        user.username = username;
        await user.save();
    }else{
        if(
            validatedPassword === false
        ){
            return res.status(400).json({message: 'invalid password'});
        }
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            user = await User.findOne({_id: id}, 'username password').exec();
            user.username = username;
            user.password = hash;
            await user.save();
        });
    }
    return res.status(200).json({message: 'updated user'});
}
module.exports = updateUser;