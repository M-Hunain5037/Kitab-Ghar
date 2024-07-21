const express = require('express');
const router = express.Router();
const { dbCredentials } = require('./db');

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all users
router.get('/users', authenticateToken, (req, res) => {
  const query = 'SELECT id, name, email, role FROM users';
  
  dbCredentials.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send({ message: 'Error fetching users' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get admin data
router.get('/admin', authenticateToken, (req, res) => {
  const adminEmail = req.user.email;

  const query = 'SELECT name, email FROM users WHERE email = ?';
  dbCredentials.query(query, [adminEmail], (err, results) => {
    if (err) {
      console.error('Error fetching admin data:', err);
      res.status(500).send({ message: 'Error fetching admin data' });
    } else {
      if (results.length > 0 && results[0].email.endsWith('@admin.com')) {
        res.status(200).json(results[0]);
      } else {
        res.status(403).send({ message: 'Forbidden' });
      }
    }
  });
});

module.exports = router;
