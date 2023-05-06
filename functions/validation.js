const validateId = (id) => {
    const regexId = (/^[a-zA-Z0-9]*$/);
    const validatedId = regexId.test(id);
    if(
        typeof id !== 'string'
        || id.length <= 0
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
    const regexBearerToken = (/^Bearer\s([a-zA-Z0-9\.]+)$/);
    const validatedBearerToken = regexBearerToken.test(bearerToken);
    if(
        typeof bearerToken !== 'string'
        || bearerToken.length <= 0
    ){
        return false;
    }
    return validatedBearerToken;
}

module.exports = {
    validateId,
    validateUsername,
    validatePassword,
    validateBearerToken
}