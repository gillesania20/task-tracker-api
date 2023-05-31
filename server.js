require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;
const connectToDB = require('./functions/connectToDB');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const authRouter = require('./routes/authRouter');
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);
app.use(errorHandler);
connectToDB(app, PORT);