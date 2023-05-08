const errorHandler = (err, req, res, next) => {
    return res.json({message: 'error'});
}
module.exports = errorHandler;