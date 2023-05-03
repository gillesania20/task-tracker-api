const User = require('./../../models/User');
const getUsers = async (req, res) => {
    let findUsers = [];
    findUsers = await User.find({}, 'username role active');
    if(
        findUsers === []
    ){
        res.json({message: 'no users yet'});
    }
    return res.json(findUsers)
}

module.exports = getUsers;