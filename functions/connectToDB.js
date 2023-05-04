const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
const connectToDB = async () => {
    try{
        await mongoose.connect(mongoDB);
        console.log('connected to DB');
    }catch(err){
        console.log('cannot connect to DB');
    }
}
module.exports = connectToDB;