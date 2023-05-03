const User = require('./../../models/User');
const { validateId } = require('./../../functions/validation');
const getUser = async (req, res) => {
    const id = req.params.id;
    const validatedId = validateId(id);
    let findUser = null;
    if(
        validatedId === false
    ){
        return res.json({message: 'invalid id'});
    }
    findUser = await User.findOne({_id: id}, 'username role active');
    if(
        findUser === null
    ){
        return res.json({message: 'user not found'});
    }
    return res.json(findUser);
}
module.exports = getUser;