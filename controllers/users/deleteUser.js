const User = require('./../../models/User');
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const regexId = (/^[a-zA-Z0-9]*$/);
    const validateId = regexId.test(id);
    let findUser = null;
    if(
        (typeof id === 'string') === false
        || validateId === false
    ){
        return res.json({message: 'invalid id'});
    }
    findUser = await User.findOne({_id: id}, '_id').lean().exec();
    if(
        findUser === null
    ){
        return res.json({message: 'user not found'});
    }
    await User.deleteOne({_id: id});
    return res.json({message: 'user deleted'});
}
module.exports = deleteUser;