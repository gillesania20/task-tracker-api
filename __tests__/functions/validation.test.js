const {
    validateId,
    validateUsername,
    validatePassword,
    validateBearerToken,
    validateTaskTitle,
    validateTaskBody,
    validateTaskCompleted
} = require('./../../functions/validation');
const mongoose = require('mongoose');
jest.mock('mongoose');
describe('validateId(id)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('id is not string', () => {
        const id = 123;
        expect(validateId(id)).toBe(false);
    });
    test('id length is zero', () => {
        const id = '';
        expect(validateId(id)).toBe(false);
    });
    test('validateObjectId is false', () => {
        const id = 'id';
        mongoose.isValidObjectId.mockReturnValue(false);
        expect(validateId(id)).toBe(false);
    });
    test('id regex is false', () => {
        const id = 'azAZ09$';
        mongoose.isValidObjectId.mockReturnValue(true);
        expect(validateId(id)).toBe(false);
    });
    test('output is true', () => {
        const id = 'azAZ09';
        mongoose.isValidObjectId.mockReturnValue(true);
        expect(validateId(id)).toBe(true);
    });
});
describe('validateUsername(username)', () =>{
    test('username is not string', () => {
        const username = 123;
        expect(validateUsername(username)).toBe(false);
    });
    test('username length is zero', () => {
        const username = '';
        expect(validateUsername(username)).toBe(false);
    });
    test('username regex is false', () => {
        const username = 'azAZ09_$';
        expect(validateUsername(username)).toBe(false);
    });
    test('output is true', () => {
        const username = 'azAZ09_';
        expect(validateUsername(username)).toBe(true);
    });
});
describe('validatePassword(password)', () => {
    test('password is not string', () => {
        const password = 1234;
        expect(validatePassword(password)).toBe(false);
    });
    test('password length is zero', () => {
        const password = '';
        expect(validatePassword(password)).toBe(false);
    });
    test('password regex is false', () => {
        const password = 'aaaaaaaa';
        expect(validatePassword(password)).toBe(false);
    });
    test('output is true', () => {
        const password = '&7aaaaaa';
        expect(validatePassword(password)).toBe(true);
    });
});
describe('validateBearerToken(bearerToken)', () => {
    test('bearerToken is not string', () => {
        const bearerToken = 123;
        expect(validateBearerToken(bearerToken)).toBe(false);
    });
    test('bearerToken length is zero', () => {
        const bearerToken = '';
        expect(validateBearerToken(bearerToken)).toBe(false);
    });
    test('bearerToken regex is false', () => {
        const bearerToken = 'bearerToken';
        expect(validateBearerToken(bearerToken)).toBe(false);
    });
    test('output is true', () => {
        const bearerToken = 'Bearer bearerToken';
        expect(validateBearerToken(bearerToken)).toBe(true);
    });
});
describe('validateTaskTitle(title)', () => {
    test('title is not string', () => {
        const title = 123;
        expect(validateTaskTitle(title)).toBe(false);
    });
    test('title length is zero', () => {
        const title = '';
        expect(validateTaskTitle(title)).toBe(false);
    });
    test('title regex is false', () => {
        const title = 'azAZ09 azAZ09 !@#$%';
        expect(validateTaskTitle(title)).toBe(false);
    });
    test('output is true', () => {
        const title = 'azAZ09 azAZ09 azAZ09';
        expect(validateTaskTitle(title)).toBe(true);
    });
});
describe('validateTaskBody(body)', () => {
    test('body is not string', () => {
        const body = 123;
        expect(validateTaskBody(body)).toBe(false);
    });
    test('body length is zero', () => {
        const body = '';
        expect(validateTaskBody(body)).toBe(false);
    });
    test('body regex is false', () => {
        const body = 'azAZ09            azAZ09 !@#$%';
        expect(validateTaskBody(body)).toBe(false);
    });
    test('output is true', () => {
        const body = 'azAZ09 azAZ09 !@#$%';
        expect(validateTaskBody(body)).toBe(true);
    });
});
describe('validateTaskCompleted(completed)', () => {
    test('completed is not boolean', () => {
        const completed = 1;
        expect(validateTaskCompleted(completed)).toBe(false);
    });
    test('output is true', () => {
        const completed = false;
        expect(validateTaskCompleted(completed)).toBe(true);
    });
});