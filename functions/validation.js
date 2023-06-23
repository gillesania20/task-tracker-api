const mongoose = require('mongoose');
const validateId = (id) => {
    const regexId = (/^[a-zA-Z0-9]*$/);
    //letters and numbers
    const validatedId = regexId.test(id);
    const validateObjectId = mongoose.isValidObjectId(id);
    let output = false;
    if(typeof id !== 'string'){
        output = false;
    }else if(
        typeof id === 'string'
        && id.length <= 0
    ){
        output = false;
    }else if(
        validateObjectId === false
    ){
        output = false;
    }else if(
        validatedId === false
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

const validateUsername = (username) => {
    const regexUsername = (/^[a-zA-Z0-9_]*$/);
    //letters, numbers and underscore
    const validatedUsername = regexUsername.test(username);
    let output = false;
    if(typeof username !== 'string'){
        output = false;
    }else if(
        typeof username === 'string'
        && username.length <= 0
    ){
        output = false;
    }else if(
        validatedUsername === false
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

const validatePassword = (password) => {
    const regexPassword =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    //atleast one letter,number, and special character then minimum length is 8
    const validatedPassword = regexPassword.test(password);
    let output = false;
    if(typeof password !== 'string'){
        output = false;
    }else if(
        typeof password === 'string'
        && password.length <= 0
    ){
        output = false;
    }else if(
        validatedPassword === false
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

const validateBearerToken = (bearerToken) => {
    const regexBearerToken = (/^Bearer\s[\S]+$/);
    //Starts with 'Bearer ' plus any characters
    const validatedBearerToken = regexBearerToken.test(bearerToken);
    let output = false;
    if(typeof bearerToken === 'string'
        && validatedBearerToken === true
    ){
        if(bearerToken.split(' ')[1] === 'null'){
            output = false;
        }else{
            output = true;
        }
    }else{
        output = false;
    }
    return output;
}

const validateTaskTitle = (title) => {
    const regexTitle = (/^[a-zA-Z0-9]+([ ][a-zA-Z0-9]+)*$/);
    //one or more letters or numbers separated with space 
    const validatedRegexTitle = regexTitle.test(title);
    let output = false;
    if(typeof title !== 'string'){
        output = false;
    }else if(
        typeof title === 'string'
        && title.length <= 0
    ){
        output =  false;
    }else if(
        typeof title === 'string'
        && title.length > 20
    ){
        output = false;
    }else if(
        validatedRegexTitle === false
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

const validateTaskBody = (body) => {
    const regexBody = (/^[\S]+([ ][\S]+)*$/);
    //one or more characters separated with space
    const validatedRegexBody = regexBody.test(body);
    let output = false;
    if(typeof body !== 'string'){
        output = false;
    }else if(
        typeof body === 'string'
        && body.length <= 0
    ){
        output = false;
    }else if(
        typeof body === 'string'
        && body.length > 255
    ){
        output = false;
    }else if(
        validatedRegexBody === false
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

const validateTaskCompleted = (completed) => {
    let output = false;
    if(
        typeof completed !== 'boolean'
    ){
        output = false;
    }else{
        output = true;
    }
    return output;
}

module.exports = {
    validateId,
    validateUsername,
    validatePassword,
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody,
    validateTaskCompleted
}