const getUser = require('./../../../controllers/users/getUser');
const { userFindOne } = require('./../../../models/users/userQueries');
const { validateId } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../functions/validation');
describe('GET api/users/:userId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid id', async () => {
        const req = {
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(false);
        await getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid id',
            user: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('user not found', async () => {
        const STATIC_PROJECTION = 'username role active';
        const req = {
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        userFindOne.mockResolvedValue(null);
        await getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found',
            user: null
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({
            _id: 'id'
        }, STATIC_PROJECTION);
    });
    test('successful get user', async () => {
        const STATIC_PROJECTION = 'username role active';
        const req = {
            params: {
                id: 'id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        userFindOne.mockResolvedValue({
            username: 'username',
            role: 'role',
            active: 'active'
        });
        await getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user found',
            user: {
                username: 'username',
                role: 'role',
                active: 'active'
            }
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({
            _id: 'id'
        }, STATIC_PROJECTION)
    });
});
