const Task = require('./Task');
const taskFind = async (filter, projection) => {
    const query = await Task.find(filter, projection)
        .lean().exec();
    return query;
}
const taskFindAndPopulate = async (filter, projection) => {
    const query = await Task.find(filter, projection)
        .populate('user', 'username').lean().exec();
    return query;
}
const taskFindOne = async (conditions, projection) => {
    const query = await Task.findOne( conditions, projection)
        .lean().exec();
    return query;
}
const taskFindOneAndPopulate = async (conditions, projection) => {
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
const taskDeleteMany = async (filter) => {
    const query = await Task.deleteMany(filter);
    return query;
}
const taskUpdateOne = async (filter, update) => {
    const query = await Task.updateOne(filter, update);
    return query;
}
module.exports = {
    taskFind,
    taskFindAndPopulate,
    taskFindOne,
    taskFindOneAndPopulate,
    taskCreate,
    taskDeleteOne,
    taskDeleteMany,
    taskUpdateOne
};