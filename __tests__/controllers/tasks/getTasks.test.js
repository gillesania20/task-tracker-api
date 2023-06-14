const getTasks = require('./../../../controllers/tasks/getTasks');
const { userFindOne } = require('./../../../models/users/userQueries');
const { taskFindAndPopulate } = require('./../../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const { validateBearerToken } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../models/tasks/taskQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('GET api/tasks', () => {
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
        validateBearerToken.mockReturnValue(false);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid bearer token',
            tasks: []
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
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found',
            tasks: []
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
    test('role Admin then no tasks yet', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id title body completed completedAt';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindAndPopulate.mockResolvedValue([]);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'no tasks yet',
            tasks: []
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindAndPopulate).toHaveBeenCalledWith({}, STATIC_PROJECTION_2);
    });
    test('role Admin then display task', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id title body completed completedAt';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindAndPopulate.mockResolvedValue([{
            _id: 'task_id',
            title: 'title',
            body: 'body',
            completed: 'completed',
            completedAt: 'completedAt'
        }]);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'display tasks',
            tasks: [{
                _id: 'task_id',
                title: 'title',
                body: 'body',
                completed: 'completed',
                completedAt: 'completedAt'
            }]
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindAndPopulate).toHaveBeenCalledWith({}, STATIC_PROJECTION_2);
    });
    test('role User then no tasks yet', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id title body completed completedAt';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindAndPopulate.mockResolvedValue([]);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'no tasks yet',
            tasks: []
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindAndPopulate).toHaveBeenCalledWith({user: 'user_id'}, STATIC_PROJECTION_2);
    });
    test('role User then display tasks', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id title body completed completedAt';
        const req = {
            headers: {
                authorization: 'bearer bearerToken'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindAndPopulate.mockResolvedValue([
            {
                _id: 'task_id',
                title: 'title',
                body: 'body',
                completed: 'completed',
                completedAt: 'completedAt',
                user: {
                    _id: 'user_id',
                    name: 'name'
                }
            }
        ]);
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'display tasks',
            tasks: [
                {
                    _id: 'task_id',
                    title: 'title',
                    body: 'body',
                    completed: 'completed',
                    completedAt: 'completedAt',
                    user: {
                        _id: 'user_id',
                        name: 'name'
                    }
                }
            ]
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindAndPopulate).toHaveBeenCalledWith({user: 'user_id'}, STATIC_PROJECTION_2);
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
        validateBearerToken.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'unknown'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unauthorized',
            tasks: []
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearer bearerToken');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
});