const User = require('./../../models/User');
const bcrypt = require('bcrypt');
const { validateUsername, validatePassword } = require('./../../functions/validation');
const addUser = async (req, res) => {
    const saltRounds = 10;
    const username = req.body.username;
    const password = req.body.password;
    const validatedUsername = validateUsername(username);
    const validatedPassword = validatePassword(password);
    let findUser = null;
    if(
        validatedUsername === false
    ){
        return res.status(400).json({message: 'invalid username. underscores, letters and numbers only'});
    }
    if(
        validatedPassword === false
    ){
        return res.status(400).json({message: 'invalid password. minimum 8 characters with atleast one letter, one number and one special character'});
    }
    findUser = await User.findOne({username}, '_id').lean().exec();
    if(
        findUser !== null
    ){
        return res.status(400).json({message: 'invalid username'});
    }
    bcrypt.hash(password, saltRounds, async function(err, hash){
        await User.create({
            username,
            password: hash
        });
    });
    return res.status(201).json({message: 'created new user'});
}
module.exports = addUser;