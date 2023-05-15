const errorHandler = (err, req, res, next) => {
    if(process.env.NODE_ENV !== 'production'){
        console.log(err.stack);
    }
    return res.status(500).json({message: 'error'});
}
module.exports = errorHandler;