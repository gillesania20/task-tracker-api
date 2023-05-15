const User = require('./User');
const userFindOne = (conditions, projection) => {
    const user = User.findOne(conditions, projection).lean().exec();
    return user;
}
module.exports = {
    userFindOne
}