const { userFindOne, userUpdateOne } = require('./../../models/user/userQueries');
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
    let hashedPassword = '';
    let update = {};
    let response = null;
    if(validatedId === false){
        response = {
            status: 400,
            message: 'invalid id'
        };
    }else{
        user = await userFindOne({_id: id}, '_id username password');
        if(user === null){
            response = {
                status: 404,
                message: 'user not found'
            };
        }else{
            if(typeof username === 'string' && validatedUsername === true){
                update.username = username;
            }
            if(typeof password === 'string' && validatedPassword === true){
                hashedPassword = bcrypt.hashSync(password, saltRounds)
                update.password = hashedPassword;
            }
            await userUpdateOne({_id: user._id.toString()}, update);
            response = {
                status: 200,
                message: 'user updated'
            }
        }
    }
    return res.status(response.status).json({
        message: response.message
    });
}
module.exports = updateUser;