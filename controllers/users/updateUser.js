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
        (typeof id === 'string') === false
        || (typeof username === 'string') === false
        || (typeof password === 'string') === false
    ){
        return res.json({message: 'invalid inputs'});
    }
    if(
        validatedId === false
    ){
        return res.json({message: 'invalid id'});
    }
    if(
        validatedUsername === false
    ){
        return res.json({message: 'invalid username'});
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
            return res.json({message: 'invalid password'});
        }
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            user = await User.findOne({_id: id}, 'username password').exec();
            user.username = username;
            user.password = hash;
            await user.save();
        });
    }
    return res.json({message: 'updated user'});
}
module.exports = updateUser;