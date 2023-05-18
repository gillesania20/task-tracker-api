const { userFindOne } = require('./../../models/users/userQueries');
const { validateId } = require('./../../functions/validation');
const getUser = async (req, res) => {
    const id = req.params.id;
    const validatedId = validateId(id);
    let findUser = null;
    let response = null;
    if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid id',
            user: null
        }
    }else{
        findUser = await userFindOne({_id: id}, 'username role active');
        if(
            findUser === null
        ){
            response = {
                status: 404,
                message: 'user not found',
                user: null
            }
        }else{
            response = {
                status: 200,
                message: 'user found',
                user: findUser
            }
        }
    }
    return res.status(response.status).json({
        message: response.message,
        user: response.user
    })
}
module.exports = getUser;