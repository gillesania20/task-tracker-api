const User = require('./../../models/User');
const { validateId } = require('./../../functions/validation');
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const validatedId = validateId(id);
    let findUser = null;
    if(
        validatedId === false
    ){
        return res.status(400).json({message: 'invalid id'});
    }
    findUser = await User.findOne({_id: id}, '_id').lean().exec();
    if(
        findUser === null
    ){
        return res.status(404).json({message: 'user not found'});
    }
    await User.deleteOne({_id: id});
    return res.status(200).json({message: 'user deleted'});
}
module.exports = deleteUser;