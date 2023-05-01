const express = require('express');
const app = express();
const connectToDB = require('./connectToDB');
app.get('/', (req, res) => {
    res.send('hello world');
});
connectToDB();