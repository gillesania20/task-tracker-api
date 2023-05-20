const deleteTask = require('./../../../controllers/tasks/deleteTask');
const { userFindOne } = require('./../../../models/users/userQueries');
const { taskFindOne, taskDeleteOne} = require('./../../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../models/tasks/taskQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('DELETE api/tasks/:taskId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid bearer token', async () => {
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
        validateBearerToken.mockReturnValue(false);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid bearer token'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
    });
    test('invalid task id', async () => {
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
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(false);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task id'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('user not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
    test('role Admin then task not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue(null);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
    });
    test('role Admin then task deleted', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id'
        });
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task deleted'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
        expect(taskDeleteOne).toHaveBeenCalledWith({
            _id: 'task_id'
        });
    });
    test('role User then task not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue(null);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2);
    });
    test('role User then task deleted', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id'
        });
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task deleted'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2);
        expect(taskDeleteOne).toHaveBeenCalledWith({_id: 'task_id'});
    });
    test('unauthorized', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'unknown'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
});