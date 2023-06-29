const updateTask = require('./../../../controllers/tasks/updateTask');
const { userFindOne } = require('./../../../models/users/userQueries');
const { taskFind, taskFindOne, taskUpdateOne } = require('./../../../models/tasks/taskQueries');
const jwt = require('jsonwebtoken');
const {
    validateId,
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody,
    validateTaskCompleted
} = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../models/tasks/taskQueries');
jest.mock('jsonwebtoken');
jest.mock('./../../../functions/validation');
describe('PATCH api/tasks/:taskId', () => {
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
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(false);
        await updateTask(req, res);
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
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(false);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task id'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('invalid task title', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(false);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task title. maximum 20 characters. letters, numbers, and space only.'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
    });
    test('invalid task body', async () => {
        const req = {
            headers: {
                authorization: 'bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(false);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid task body. maximum 255 characters. any characters.'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
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
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'role'
        });
        userFindOne.mockResolvedValue(null);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith('completed');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
    });
    test('role Admin then task not found', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: 'completed'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue(null)
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith('completed');
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
    });
    test('role Admin then title already taken', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const STATIC_PROJECTION_3 = '_id';
        const update = {
            title: 'title',
            body: 'body',
            completed: true,
            completedAt: Date.now()
        };
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id',
            completed: false,
            user: 'user_id'
        });
        taskFind.mockResolvedValue([
            { _id: '_id_1'}
        ])
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'title already taken'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith(true);
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
        expect(taskFind).toHaveBeenCalledWith({
            title: {$regex: /^title$/i},
            user: 'user_id'}, STATIC_PROJECTION_3);
    })
    test('role Admin then task updated', async () => {
        jest.useFakeTimers();
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const STATIC_PROJECTION_3 = '_id';
        const update = {
            title: 'title',
            body: 'body',
            completed: true,
            completedAt: Date.now()
        };
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'Admin'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id',
            completed: false,
            user: 'user_id'
        });
        taskFind.mockResolvedValue([])
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task updated'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith(true);
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id'},
            STATIC_PROJECTION_2);
        expect(taskFind).toHaveBeenCalledWith({
            title: {$regex: /^title$/i},
            user: 'user_id'}, STATIC_PROJECTION_3);
        expect(taskUpdateOne).toHaveBeenCalledWith({_id: 'task_id'},
            update);
    });
    test('role User then task not found', async () => {
        jest.useFakeTimers();
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue(null);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task not found'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith(true);
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2);
    });
    test('role User then title already taken', async () => {
        jest.useFakeTimers();
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const STATIC_PROJECTION_3 = '_id';
        const update = {
            title: 'title',
            body: 'body',
            completed: true,
            completedAt: Date.now()
        };
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id',
            completed: false,
            user: 'user_id'
        });
        taskFind.mockResolvedValue([
            { _id: '_id_1'}
        ]);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'title already taken'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith(true);
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2);
        expect(taskFind).toHaveBeenCalledWith(
            {title: { $regex: /^title$/i }, user: 'user_id'},
            STATIC_PROJECTION_3);
    });
    test('role User then task updated', async () => {
        jest.useFakeTimers();
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = '_id';
        const STATIC_PROJECTION_2 = '_id completed user';
        const STATIC_PROJECTION_3 = '_id';
        const update = {
            title: 'title',
            body: 'body',
            completed: true,
            completedAt: Date.now()
        };
        const req = {
            headers: {
                authorization: 'Bearer bearerToken'
            },
            params: {
                id: 'id'
            },
            body: {
                title: 'title',
                body: 'body',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateBearerToken.mockReturnValue(true);
        validateId.mockReturnValue(true);
        validateTaskTitle.mockReturnValue(true);
        validateTaskBody.mockReturnValue(true);
        validateTaskCompleted.mockReturnValue(true);
        jwt.verify.mockReturnValue({
            username: 'username',
            role: 'User'
        });
        userFindOne.mockResolvedValue({
            _id: 'user_id'
        });
        taskFindOne.mockResolvedValue({
            _id: 'task_id',
            completed: false,
            user: 'user_id'
        });
        taskFind.mockResolvedValue([]);
        await updateTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'task updated'
        });
        expect(validateBearerToken).toHaveBeenCalledWith('Bearer bearerToken');
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateTaskTitle).toHaveBeenCalledWith('title');
        expect(validateTaskBody).toHaveBeenCalledWith('body');
        expect(validateTaskCompleted).toHaveBeenCalledWith(true);
        expect(jwt.verify).toHaveBeenCalledWith('bearerToken', ACCESS_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(taskFindOne).toHaveBeenCalledWith({_id: 'id', user: 'user_id'},
            STATIC_PROJECTION_2);
        expect(taskFind).toHaveBeenCalledWith(
            {title: { $regex: /^title$/i }, user: 'user_id'},
            STATIC_PROJECTION_3);
        expect(taskUpdateOne).toHaveBeenCalledWith({_id: 'task_id'}, update);
    });
});