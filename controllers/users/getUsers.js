const User = require('./../../models/User');
const getUsers = async (req, res) => {
    let findUsers = [];
    findUsers = await User.find({}, 'username role active');
    if(
        findUsers.length === 0
    ){
        return res.json({message: 'no users yet'});
    }
    return res.json(findUsers)
}

module.exports = getUsers;