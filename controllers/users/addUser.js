const User = require('./../../models/User');
const bcrypt = require('bcrypt');
const addUser = async (req, res) => {
    const saltRounds = 10;
    const username = req.body.username;
    const password = req.body.password;
    const regexPassword =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const validatedPassword = regexPassword.test(password);
    let findUser = null;
    if(
        (typeof username === 'string') === false
        || (typeof password === 'string') === false
    ){
        return res.json({message: 'invalid inputs'});
    }
    if(
        validatedPassword === false
    ){
        return res.json({message: 'invalid password. minimum 8 characters with atleast one letter, one number and one special character'});
    }
    findUser = await User.findOne({username}, '_id').lean().exec();
    if(
        findUser !== null
    ){
        return res.json({message: 'invalid username'});
    }
    bcrypt.hash(password, saltRounds, async function(err, hash){
        await User.create({
            username,
            password: hash
        });
    });
    return res.json({message: 'created new user'});
}
module.exports = addUser;