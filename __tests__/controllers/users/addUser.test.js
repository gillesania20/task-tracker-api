const addUser = require('./../../../controllers/users/addUser');
const { userCreate, userFindOne} = require('./../../../models/user/userQueries');
const bcrypt = require('bcrypt');
const { validateUsername, validatePassword } = require('./../../../functions/validation');
jest.mock('./../../../models/user/userQueries');
jest.mock('bcrypt');
jest.mock('./../../../functions/validation');
describe('PATCH api/users/:userId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid username', async () => {
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateUsername.mockReturnValue(false);
        await addUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid username. underscores, letters and numbers only'
        });
        expect(validateUsername).toHaveBeenCalledWith('username');
    });
    test('invalid password', async () => {
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        await addUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid password. minimum 8 characters with atleast one letter, one number and one special character'
        });
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
    });
    test('username alread taken', async () => {
        const STATIC_PROJECTION = '_id';
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue({_id: '_id'});
        await addUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid username'
        });
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
        expect(userFindOne).toHaveBeenCalledWith({
            username: 'username'
        }, STATIC_PROJECTION);
    });
    test('successful added user', async () => {
        const STATIC_PROJECTION = '_id';
        const STATIC_SALTROUNDS = 10;
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue(null);
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        await addUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: 'created new user'});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'},
            STATIC_PROJECTION);
        expect(bcrypt.hashSync).toHaveBeenCalledWith('password', STATIC_SALTROUNDS);
        expect(userCreate).toHaveBeenCalledWith({
            username: 'username',
            password: 'hashedPassword'
        });
    });
});