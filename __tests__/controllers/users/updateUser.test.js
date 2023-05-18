const updateUser = require('./../../../controllers/users/updateUser');
const { userFindOne, userUpdateOne } = require('./../../../models/user/userQueries');
const bcrypt = require('bcrypt');
const { validateId, validateUsername, validatePassword } = require('./../../../functions/validation');
jest.mock('./../../../models/user/userQueries');
jest.mock('bcrypt');
jest.mock('./../../../functions/validation');
describe('PATCH api/users/:userId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid id', async () => {
        const req = {
            params: {
                id: 'id'
            },
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(false);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid id'
        });
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('user not found', async () => {
        const STATIC_PROJECTION = '_id username password';
        const req = {
            params: {
                id: 'id'
            },
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validateId.mockReturnValue(true);
        userFindOne.mockResolvedValue(null);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({_id: 'id'}, STATIC_PROJECTION);
    });
    test('user updated', async () => {
        const STATIC_PROJECTION = '_id username password';
        const STATIC_SALTROUNDS = 10;
        const req = {
            params: {
                id: '_id_1'
            },
            body: {
                username: 'username_1',
                password: 'password_1'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateId.mockReturnValue(true);
        userFindOne.mockResolvedValue({
            _id: '_id_2',
            username: 'username_2',
            password: 'password_2'
        });
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'user updated'});
        expect(validateId).toHaveBeenCalledWith('_id_1');
        expect(userFindOne).toHaveBeenCalledWith({_id: '_id_1'}, STATIC_PROJECTION);
        expect(bcrypt.hashSync).toHaveBeenCalledWith('password_1', STATIC_SALTROUNDS);
        expect(userUpdateOne).toHaveBeenCalledWith(
            {
                _id: '_id_2'
            },
            {
                username: 'username_1',
                password: 'hashedPassword'
            }
        );
    });
});