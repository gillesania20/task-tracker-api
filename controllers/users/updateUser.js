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
    if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid id'
        }
    }else if(
        validatedUsername === false
    ){
        response = {
            status: 400,
            message: 'invalid username'
        }
    }else{
        user = await userFindOne({_id: id}, '_id username');
        if( user === null){
            response = {
                status: 404,
                message: 'user not found'
            }
        }else{
            if(
                typeof password === 'undefined' || password.length <= 0 
            ){
                update = {};
                (user.username !== username)? update.username = username : '';
                if(Object.keys(update).length !== 0){
                    await userUpdateOne({_id: id}, update);
                }
                response = {
                    status: 200,
                    message: 'updated user'
                }
            }else{
                if(
                    validatedPassword === false
                ){
                    response = {
                        status: 400,
                        message: 'invalid password'
                    }
                }else{
                    hashedPassword = bcrypt.hashSync(password, saltRounds);
                    update = {};
                    (user.username !== username)? update.username = username : '';
                    update.password = password;
                    await userUpdateOne({_id: id}, update);
                    response = {
                        status: 200,
                        message: 'updated user'
                    }
                }
            }
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = updateUser;