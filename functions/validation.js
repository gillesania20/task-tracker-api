const mongoose = require('mongoose');
const validateId = (id) => {
    const regexId = (/^[a-zA-Z0-9]*$/);
    const validatedId = regexId.test(id);
    const validateObjectId = mongoose.isValidObjectId(id);
    if(
        typeof id !== 'string'
        || id.length <= 0
    ){
        return false;
    }
    if(
        validateObjectId === false
    ){
        return false;
    }
    return validatedId;
}

const validateUsername = (username) => {
    const regexUsername = (/^[a-zA-Z0-9_]*$/);
    const validatedUsername = regexUsername.test(username);
    if(
        typeof username !=='string'
        || username.length <= 0
    ){
        return false;
    }
    return validatedUsername;
}

const validatePassword = (password) => {
    const regexPassword =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const validatedPassword = regexPassword.test(password);
    if(
        typeof password !== 'string'
        || password.length <= 0
    ){
        return false;
    }
    return validatedPassword;
}

const validateBearerToken = (bearerToken) => {
    const regexBearerToken = (/^Bearer\s[\S]+$/);
    const validatedBearerToken = regexBearerToken.test(bearerToken);
    if(
        typeof bearerToken !== 'string'
        || bearerToken.length <= 0
    ){
        return false;
    }
    return validatedBearerToken;
}

const validateTaskTitle = (title) => {
    const regexTitle = (/^[a-zA-Z0-9]+([ ][a-zA-Z0-9]+)*$/);
    const validatedRegexTitle = regexTitle.test(title);
    if(
        typeof title !== 'string'
        || title.length <= 0
        || title.length > 20
    ){
        return false;
    }
    return validatedRegexTitle;
}

const validateTaskBody = (body) => {
    const regexBody = (/^[\S]+([ ][\S]+)*$/);
    const validatedRegexBody = regexBody.test(body);
    if(
        typeof body !== 'string'
        || body.length <= 0
        || body.length > 255
    ){
        return false;
    }
    return validatedRegexBody;
}

const validateTaskCompleted = (completed) => {
    if(
        typeof completed !== 'boolean'
    ){
        return false;
    }
    return true;
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