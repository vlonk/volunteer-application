const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } 
    catch (err) {
        console.error('Error reading users.json:', err);
        return {};
    }
}

function writeUsers(usersObj) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(usersObj, null, 2));
    } 
    catch (err) {
        console.error('Error writing to users.json:', err);
    }
}

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required.' });
    }

    // read user data
    const usersObj = readUsers();

    // check if user with this email already exists
    const existingUser = Object.values(usersObj).find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ msg: 'User already exists with that email.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newId = Date.now();
        const newUser = {
            id: newId,
            name: name || '',
            email,
            password: hashedPassword,
            role: role || 'user'
        };

    usersObj[newId] = newUser;

    // write updated users to file
    writeUsers(usersObj);

    // generate JWT token
    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '1h' }
    );

    return res.status(201).json({
        msg: 'User registered successfully',
        token
    });
} 
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required.' });
    }

    // read users
    const usersObj = readUsers();

    // find user by email
    const user = Object.values(usersObj).find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            msg: 'Login successful',
            token
        });
    } 
        catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
};