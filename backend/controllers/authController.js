const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


exports.signup = async (req, res) => {
    try {
        const { email, password, name, address, address2, city, state, zip, number, emergency, skills, preferences, role, availability, eventhistoryId  } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists with that email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newId = Date.now().toString();

        const newUser = await User.create({
            id: newId,
            name: name || '',
            address: address || '',
            address2: address2 || '',
            city: city || '',
            state: state || '',
            zip: zip || '',
            number: number || '',
            emergency: emergency || '',
            email: email || '',
            skills: skills || [],
            preferences: preferences || [],
            role: role || 'user',
            password: hashedPassword,
            availability: availability || [],
            eventhistoryId: eventhistoryId || `history_${newId}`
        });

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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'email and password are required.' });
        }

        // find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

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
            token,
            id: user.id
        });
    } 
        catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
};