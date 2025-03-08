// mock the entire 'bcrypt' module
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('fakeHashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
    genSalt: jest.fn().mockResolvedValue('fakeSalt')
}));

    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcrypt');
    const { signup, login } = require('../controllers/authController');

    jest.mock('fs');

    describe('authController', () => {
        let req;
        let res;
        let mockUsers;

    beforeEach(() => {
        jest.clearAllMocks();

        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockUsers = {
            "1": {
            id: 1,
            email: "existing@example.com",
            password: "$2b$10$SomeHashedPasswordString",
            role: "user"
            }
        };
        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
    });

    // signup test
    describe('signup', () => {
        it('should return 400 if email or password is missing', async () => {
            req.body = { email: '', password: '' };
            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Email and password are required.' });
        });

        it('should return 400 if user already exists', async () => {
            req.body = { email: 'existing@example.com', password: 'test123' };
            await signup(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists with that email.' });
        });

        it('should create a new user and return 201 with a token', async () => {
            req.body = { email: 'newuser@example.com', password: 'test123' };
    
            // By default, our mock returns hash = 'fakeHashedPassword'
            await signup(req, res);
    
            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('test123', 'fakeSalt');
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'User registered successfully',
            token: expect.any(String)
        }));
        expect(fs.writeFileSync).toHaveBeenCalled();
        });
    });

    // login test
    describe('login', () => {
        it('should return 400 if email or password is missing', async () => {
            req.body = { email: '', password: '' };
            await login(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Username and password are required.' });
        });
        it('should return 400 if user is not found', async () => {
            req.body = { email: 'doesnotexist@example.com', password: 'test123' };
            await login(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
        });

        it('should return 400 if password does not match', async () => {
            req.body = { email: 'existing@example.com', password: 'wrongpassword' };
    
            bcrypt.compare.mockResolvedValueOnce(false);
    
            await login(req, res);
    
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', '$2b$10$SomeHashedPasswordString');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
        });

        it('should return 200 and a token if credentials are correct', async () => {
            req.body = { email: 'existing@example.com', password: 'correctpassword' };
    
            // compare() returns true by default, but let's be explicit
            bcrypt.compare.mockResolvedValueOnce(true);
    
            await login(req, res);
    
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', '$2b$10$SomeHashedPasswordString');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Login successful',
            token: expect.any(String)
            }));
        });
    });
});
