const addTask = require('./../../../controllers/tasks/addTask');
const { userFindOne } = require('./../../../models/users/userQueries');
const { taskFindOne, taskCreate } = require('./../../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const {
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody
} = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../models/tasks/taskQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('POST api/tasks', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid bearer token', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(false);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid bearer token'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
    });
    test('invalid task title', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(false);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task title'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
    });
    test('invalid task body', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(false);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task body'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
    });
    test('user not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
    test('title already taken', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id'
        });
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'title already taken'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith(
            {
                title: {
                    $regex: /^title$/i
                },
                user: 'user_id'
            },
            STATIC_PROJECTION_2
        );
    });
    test('task added', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            body: {
                title: 'title',
                body: 'body'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue(null);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task added'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith(
            {
                title: {
                    $regex: /^title$/i
                },
                user: 'user_id'
            },
            STATIC_PROJECTION_2
        );
    });
});