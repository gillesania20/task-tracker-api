const errorHandler = (err, req, res, next) => {
    let response = null;
    if(process.env.NODE_ENV !== 'production'){
        console.log(err.stack);
    }
    if(typeof err.message !== 'undefined' && err.message === 'jwt expired'){
        response = {
            status: 400,
            message: err.message
        }
    }else{
        response = {
            status: 500,
            message: 'error'
        }
    }
    return res.status(response.status).json({message: response.message});
}
module.exports = errorHandler;