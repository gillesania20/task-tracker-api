const logout = require('./../../../controllers/auth/logout');
describe('POST api/auth/logout', () => {
    test('logout success', async () => {
        const STATIC_NAME = 'jwt';
        const req = jest.fn();
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        }
        await logout(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'logout successful'});
        expect(res.clearCookie).toHaveBeenCalledWith(STATIC_NAME);
    });
});