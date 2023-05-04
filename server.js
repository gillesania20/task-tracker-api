require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3500;
const connectToDB = require('./functions/connectToDB');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const authRouter = require('./routes/authRouter');
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);
connectToDB(app, PORT);