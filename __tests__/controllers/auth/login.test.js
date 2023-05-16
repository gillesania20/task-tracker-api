const login = require('./../../../controllers/auth/login');
const { userFindOne } = require('./../../../models/user/userQueries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    validateUsername,
    validatePassword
} = require('./../../../functions/validation');
const {
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
    COOKIE_MAX_AGE,
    COOKIE_HTTP_ONLY,
    COOKIE_SAME_SITE,
    COOKIE_SECURE
} = require('./../../../constants');
jest.mock('./../../../models/user/userQueries');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('./../../../functions/validation');
describe('POST /api/auth/login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('invalid username', async () => {
        const req = {
            body:{
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validateUsername.mockReturnValue(false);
        validatePassword.mockReturnValue(true);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message:'invalid username', accessToken: null});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
    });
    test('invalid password', async () => {
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'invalid password', accessToken: null});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
    });
    test('wrong username', async () => {
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue(null);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'invalid username or password', accessToken: null});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'}, 'username password role');
    });
    test('wrong password', async () => {
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue({
            username: 'username',
            password: 'hashedPassword',
            role: 'role'
        });
        bcrypt.compare.mockResolvedValue(false);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'invalid username or password', accessToken: null});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'}, 'username password role');
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });
    test('successful login', async () => {
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const ACCESS_TOKEN_EXPIRES_IN = (process.env.NODE_ENV === 'production')?'5s':'1h';;
        const REFRESH_TOKEN_EXPIRES_IN = '1d';
        const STATIC_NAME = 'jwt';
        const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
        const COOKIE_HTTP_ONLY = true;
        const COOKIE_SAME_SITE = (process.env.NODE_ENV === 'production')?'none':false;
        const COOKIE_SECURE = (process.env.NODE_ENV === 'production')?true:false;
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        }
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        userFindOne.mockResolvedValue({
            username: 'username',
            password: 'hashedPassword',
            role: 'role'
        });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValueOnce('accessToken');
        jwt.sign.mockReturnValueOnce('refreshToken');
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({accessToken: 'accessToken', message: 'successful login'});
        expect(validateUsername).toHaveBeenCalledWith('username');
        expect(validatePassword).toHaveBeenCalledWith('password');
        expect(userFindOne).toHaveBeenCalledWith({username: 'username'}, 'username password role');
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                username:'username',
                role: 'role'
            },
            ACCESS_TOKEN,
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN
            }
        );
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                username:'username'
            },
            REFRESH_TOKEN,
            {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN
            }
        );
        expect(res.cookie).toHaveBeenCalledWith(
            STATIC_NAME,
            'refreshToken',
            {
                maxAge: COOKIE_MAX_AGE,
                httpOnly: COOKIE_HTTP_ONLY,
                sameSite: COOKIE_SAME_SITE,
                secure: COOKIE_SECURE
            }
        )
    });
});