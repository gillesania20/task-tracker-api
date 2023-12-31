const updateUser = require('./../../../controllers/users/updateUser');
const { userFindOne, userUpdateOne, userFind } = require('./../../../models/users/userQueries');
const bcrypt = require('bcrypt');
const { validateId, validateUsername, validatePassword } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
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
    test('invalid username', async () => {
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
        validateId.mockReturnValue(true);
        validateUsername.mockReturnValue(false)
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid username. underscores, letters and numbers only'
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateUsername).toHaveBeenCalledWith('username');
    });
    test('invalid password', async () => {
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
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid password. minimum 8 characters with atleast one letter, one number and one special character'
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
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
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue(null);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({_id: 'id'}, STATIC_PROJECTION);
    });
    test('user already taken', async () => {
        const STATIC_PROJECTION_1 = '_id username password';
        const STATIC_PROJECTION_2 = '_id';
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
        userFind.mockResolvedValue([
            { _id: '_id_3'}
        ]);
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'username already taken'});
        expect(validateId).toHaveBeenCalledWith('_id_1');
        expect(userFindOne).toHaveBeenCalledWith({_id: '_id_1'}, STATIC_PROJECTION_1);
        expect(validateUsername).toHaveBeenCalledWith('username_1');
        expect(validatePassword).toHaveBeenCalledWith('password_1');
        expect(userFind).toHaveBeenCalledWith({username: 'username_1'}, STATIC_PROJECTION_2);
    });
    test('user updated', async () => {
        const STATIC_PROJECTION_1 = '_id username password';
        const STATIC_PROJECTION_2 = '_id';
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
        userFind.mockResolvedValue([]);
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'user updated'});
        expect(validateId).toHaveBeenCalledWith('_id_1');
        expect(userFindOne).toHaveBeenCalledWith({_id: '_id_1'}, STATIC_PROJECTION_1);
        expect(userFind).toHaveBeenCalledWith({username: 'username_1'}, STATIC_PROJECTION_2);
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