require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3500;
const mongoDB = process.env.MONGODB_URI;
const connectToDB = async () => {
    try{
        await mongoose.connect(mongoDB);
        console.log('connected to DB');
        app.listen(PORT, () => console.log('listening to port '+PORT));
    }catch(err){
        console.log('cannot connect to DB');
    }
}

module.exports = connectToDB;