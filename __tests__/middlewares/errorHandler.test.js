const errorHandler = require('./../../middlewares/errorHandler');
describe('MIDDLEWARE errorHandler', () => {
    test('jwt expired', () => {
        const err = {
            stack: 'errorStack',
            message: 'jwt expired'
        };
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = {};
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'jwt expired'
        });
    });
    test('error', () => {
        const err = {
            stack: 'errorStack'
        };
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = {};
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error'
        });
    });
});