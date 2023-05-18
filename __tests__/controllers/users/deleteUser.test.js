const deleteUser = require('./../../../controllers/users/deleteUser');
const { userFindOne, userDeleteOne } = require('./../../../models/users/userQueries');
const { validateId } = require('./../../../functions/validation');
jest.mock('./../../../models/users/userQueries');
jest.mock('./../../../functions/validation');
describe('DELETE api/users/:userId', () => {
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
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid id'
        });
        expect(validateId).toHaveBeenCalledWith('id');
    });
    test('user not found', async () => {
        const STATIC_PROJECTION = '_id';
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
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user not found'
        });
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({
            _id: 'id'
        }, STATIC_PROJECTION);
    });
    test('successful delete user', async () => {
        const STATIC_PROJECTION = '_id';
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
        userFindOne.mockResolvedValue({_id: '_id'});
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'user deleted'});
        expect(validateId).toHaveBeenCalledWith('id');
        expect(userFindOne).toHaveBeenCalledWith({
            _id: 'id'
        }, STATIC_PROJECTION);
        expect(userDeleteOne).toHaveBeenCalledWith({ _id: 'id'});
    });
});
