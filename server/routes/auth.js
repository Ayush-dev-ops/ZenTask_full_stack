const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashed, role || 'member']
        );
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.error('Signup error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(404).json({ message: 'User not found' });

        const valid = await bcrypt.compare(password, rows[0].password);
        if (!valid) return res.status(401).json({ message: 'Wrong password' });

        const token = jwt.sign(
            { id: rows[0].id, role: rows[0].role, name: rows[0].name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: rows[0].id, name: rows[0].name, role: rows[0].role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// verify token and get user
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, email, role FROM users'
        );
        res.json(rows);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;