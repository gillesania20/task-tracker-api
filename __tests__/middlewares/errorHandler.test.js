const errorHandler = require('./../../middlewares/errorHandler');
describe('MIDDLEWARE errorHandler', () => {
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