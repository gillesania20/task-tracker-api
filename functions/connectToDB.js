const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
const connectToDB = async (app, port) => {
    try{
        await mongoose.connect(mongoDB);
        console.log('connected to DB');
        app.listen(port, () => console.log('listening to port '+port)); 
    }catch(err){
        console.log('cannot connect to DB');
    }
}
module.exports = connectToDB;