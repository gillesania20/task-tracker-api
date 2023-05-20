const getTask = require('./../../../controllers/tasks/getTask');
const { userFindOne } = require('./../../../models/users/userQueries');
const { taskFindOneAndPopulate } = require('./../../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateId, validateBearerToken } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../models/tasks/taskQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('GET api/tasks/:taskId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid id', async () => {
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(false);
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid id',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('invalid bearer token', async () => {
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(false);
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid bearer token',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
    });
    test('user not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
    test('role Admin then task not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '-_id title body completed completedAt';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOneAndPopulate.mockResolvedValue(null);
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOneAndPopulate).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
    });
    test('role Admin then display task', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '-_id title body completed completedAt';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOneAndPopulate.mockResolvedValue({
            title: 'title',
            body: 'body',
            completed: 'completed',
            completedAt: 'completedAt'
        });
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'display task',
            task: {
                title: 'title',
                body: 'body',
                completed: 'completed',
                completedAt: 'completedAt'
            }
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOneAndPopulate).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
    });
    test('role User then task not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '-_id title body completed completedAt';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOneAndPopulate.mockResolvedValue(null);
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOneAndPopulate).toHaveBeenCalledWith(
            {_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2
        );
    });
    test('role User then display task', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '-_id title body completed completedAt';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOneAndPopulate.mockResolvedValue({
            title: 'title',
            body: 'body',
            completed: 'completed',
            completedAt: 'completedAt'
        });
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'display task',
            task: {
                title: 'title',
                body: 'body',
                completed: 'completed',
                completedAt: 'completedAt'
            }
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOneAndPopulate).toHaveBeenCalledWith(
            {_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2
        );
    });
    test('unauthorized', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            params: {
                id: 'id'
            },
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'unknown'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized',
            task: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
});