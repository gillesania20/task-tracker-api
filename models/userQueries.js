const User = require('./User');
const userFindOne = async (conditions, projection) => {
    const user = await User.findOne(conditions, projection).lean().exec();
    return user;
}
module.exports = {
    userFindOne
}