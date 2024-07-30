const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbCredentials } = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  dbCredentials.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send({ message: 'Error logging in' });
      return;
    }

    if (results.length === 0) {
      res.status(401).send({ message: 'Invalid credentials' });
      return;
    }

    const user = results[0];

    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Login successful', token, role: user.role });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error comparing passwords:', err);
      res.status(500).send({ message: 'Error logging in' });
    }
  });
});

module.exports = router;
