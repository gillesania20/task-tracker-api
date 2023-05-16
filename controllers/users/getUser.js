const User = require('./../../models/user/User');
const { validateId } = require('./../../functions/validation');
const getUser = async (req, res) => {
    const id = req.params.id;
    const validatedId = validateId(id);
    let findUser = null;
    if(
        validatedId === false
    ){
        return res.status(400).json({message: 'invalid id'});
    }
    findUser = await User.findOne({_id: id}, 'username role active');
    if(
        findUser === null
    ){
        return res.status(404).json({message: 'user not found'});
    }
    return res.status(200).json(findUser);
}
module.exports = getUser;