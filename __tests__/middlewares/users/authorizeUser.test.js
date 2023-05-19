const authorizeUser = require('./../../../middlewares/users/authorizeUser');
const { userFindOne } = require('./../../../models/users/userQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('MIDDLEWARE users/authorizeUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('unauthorized', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(false);
        await authorizeUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
    });
    test('invalid id', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(false);
        await authorizeUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid id'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('user not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await authorizeUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('role is Admin called next()', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'id2'
        });
        await authorizeUser(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('role is User but unauthorized', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'id2'
        });
        await authorizeUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('role is User called next()', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'id'
        });
        await authorizeUser(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('role is unknown', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'unknown'
        });
        userFindOne.mockResolvedValue({
            _id: 'id'
        });
        await authorizeUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
});