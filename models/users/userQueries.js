const User = require('./User');
const userFind = async (filter, projection) => {
    const query = await User.find(filter, projection).lean().exec();
    return query;
}
const userFindOne = async (conditions, projection) => {
    const query = await User.findOne(conditions, projection).lean().exec();
    return query;
}
const userCreate = async (docs) => {
    const query = await User.create(docs);
    return query;
}
const userDeleteOne = async (conditions) => {
    const query = await User.deleteOne(conditions);
    return query;
}
const userUpdateOne = async (filter, update) => {
    const query = await User.updateOne(filter, update);
    return query;
}
module.exports = {
    userFindOne,
    userCreate,
    userDeleteOne,
    userFind,
    userUpdateOne
}