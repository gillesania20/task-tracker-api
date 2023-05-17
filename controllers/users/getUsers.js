const { userFind } = require('./../../models/user/userQueries');
const getUsers = async (req, res) => {
    let findUsers = [];
    let response = null;
    findUsers = await userFind({}, 'username role active');
    if(
        findUsers.length === 0
    ){
        response = {
            status: 200,
            message: 'no users yet',
            users: findUsers
        }
    }else{
        response = {
            status: 200,
            message: 'users found',
            users: findUsers
        }
    }
    return res.status(response.status).json({
        message: response.message,
        users: response.users
    });
}

module.exports = getUsers;