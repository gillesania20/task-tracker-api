const Task = require('./Task');
const taskFind = async (filter, projection) => {
    const query = await Task.find(filter, projection)
        .populate('user', 'username').lean().exec();
    return query;
}
const taskFindOne = async (conditions, projection) => {
    const query = await Task.findOne( conditions, projection)
        .populate('user', 'username').lean().exec();
    return query;
}
const taskCreate = async (docs) => {
    const query = await Task.create(docs);
    return query;
}
const taskDeleteOne = async (conditions) => {
    const query = await Task.deleteOne(conditions);
    return query;
}
module.exports = {
    taskFind,
    taskFindOne,
    taskCreate,
    taskDeleteOne
};