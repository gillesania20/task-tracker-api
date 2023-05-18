const getUsers = require('./../../../controllers/users/getUsers');
const { userFind } = require('./../../../models/users/userQueries');
jest.mock('./../../../models/users/userQueries');
describe('GET api/users', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('no users', async () => {
        const STATIC_PROJECTION = 'username role active'
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        userFind.mockResolvedValue([]);
        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'no users yet',
            users: []
        });
        expect(userFind).toHaveBeenCalledWith({}, STATIC_PROJECTION);
    });
    test('successful get users', async () => {
        const STATIC_PROJECTION = 'username role active';
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        userFind.mockResolvedValue([
            {
                username: 'user1',
                role: 'role',
                active: 'active'
            }
        ]);
        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'users found',
            users: [
                {
                    username: 'user1',
                    role: 'role',
                    active: 'active'
                }
            ]
        });
        expect(userFind).toHaveBeenCalledWith({}, STATIC_PROJECTION);
    });
});