const { userCreate, userFindOne} = require('./../../models/users/userQueries');
const bcrypt = require('bcrypt');
const { validateUsername, validatePassword } = require('./../../functions/validation');
const addUser = async (req, res) => {
    const saltRounds = 10;
    const username = req.body.username;
    const password = req.body.password;
    const validatedUsername = validateUsername(username);
    const validatedPassword = validatePassword(password);
    let findUser = null;
    let hashedPassword = '';
    let response = null;
    if(
        validatedUsername === false
    ){
        response = {
            status: 400,
            message: 'invalid username. underscores, letters and numbers only'
        }
    }else if(
        validatedPassword === false
    ){
        response = {
            status: 400,
            message: 'invalid password. minimum 8 characters with atleast one letter, one number and one special character'
        }
    }else{
        findUser = await userFindOne({username}, '_id');
        if(
            findUser !== null
        ){
            response = {
                status: 400,
                message: 'invalid username'
            }
        }else{
            hashedPassword = bcrypt.hashSync(password, saltRounds)
            await userCreate({
                username,
                password: hashedPassword
            });
            response = {
                status: 201,
                message: 'created new user'
            }
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = addUser;