const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to check if user is admin or manager
const isAdminOrManager = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'manager') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin or Manager role required.' });
    }
};

module.exports = { verifyToken, isAdminOrManager };
