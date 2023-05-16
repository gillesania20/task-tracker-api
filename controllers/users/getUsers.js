const User = require('./../../models/user/User');
const getUsers = async (req, res) => {
    let findUsers = [];
    findUsers = await User.find({}, 'username role active');
    if(
        findUsers.length === 0
    ){
        return res.status(200).json({message: 'no users yet'});
    }
    return res.status(200).json(findUsers)
}

module.exports = getUsers;