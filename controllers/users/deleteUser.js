const { userFindOne, userDeleteOne } = require('./../../models/user/userQueries');
const { validateId } = require('./../../functions/validation');
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const validatedId = validateId(id);
    let findUser = null;
    let response = null;
    if(
        validatedId === false
    ){
        response = {
            status: 400,
            message: 'invalid id'
        }
    }else{
        findUser = await userFindOne({_id: id}, '_id');
        if(
            findUser === null
        ){
            response = {
                status: 404,
                message: 'user not found'
            }
        }else{
            await userDeleteOne({_id: id});
            response = {
                status: 200,
                message: 'user deleted'
            }
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = deleteUser;