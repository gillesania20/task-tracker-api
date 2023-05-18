const authorizeAdmin = require('./../../../middlewares/users/authorizeAdmin');
const { userFindOne } = require('./../../../models/users/userQueries');
const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('MIDDLEWARE users/authorizeAdmin', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid bearer token', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(false);
        await authorizeAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid bearer token'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
    });
    test('user not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await authorizeAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('unauthorized', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue('id');
        await authorizeAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('unauthorized', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue('id');
        await authorizeAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
});