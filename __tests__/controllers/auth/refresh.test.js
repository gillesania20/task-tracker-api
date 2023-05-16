const refresh = require('./../../../controllers/auth/refresh');
const jwt = require('jsonwebtoken');
const { userFindOne } = require('./../../../models/user/userQueries');
const { ACCESS_TOKEN_EXPIRES_IN } = require('./../../../constants');
jest.mock('jsonwebtoken');
jest.mock('./../../../models/user/userQueries');
describe('POST api/auth/refresh', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('refresh token not available', async () => {
        const req = {
            cookies:{}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        await refresh(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'no refresh token', accessToken: null});
    });
    test('cannot find user', async () => {
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const STATIC_PROJECTION = 'username role';
        const req = {
            cookies: {
                jwt: 'jwtCookie'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        jwt.verify.mockReturnValue({username: 'username', role: 'role'});
        userFindOne.mockReturnValue(null);
        await refresh(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'user not found', accessToken: null});
        expect(jwt.verify).toHaveBeenCalledWith('jwtCookie', REFRESH_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'}, STATIC_PROJECTION);
    });
    test('successfully refreshed the accessToken', async () => {
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const STATIC_PROJECTION = 'username role';
        const ACCESS_TOKEN_EXPIRES_IN = (process.env.NODE_ENV === 'production')?'5s':'1h';
        const req = {
            cookies: {
                jwt: 'jwtCookie'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        jwt.verify.mockReturnValue({ username: 'username', role: 'role'});
        userFindOne.mockResolvedValue({ username: 'username2', role: 'role2'});
        jwt.sign.mockReturnValue('jwtSign');
        await refresh(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'successful token refresh',
            accessToken: 'jwtSign'
        });
        expect(jwt.verify).toHaveBeenCalledWith('jwtCookie', REFRESH_TOKEN);
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'}, STATIC_PROJECTION);
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                username: 'username2',
                role: 'role2'
            },
            ACCESS_TOKEN,
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN
            }
        );
    });
});