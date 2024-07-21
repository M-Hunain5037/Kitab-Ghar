// backend/authController.js
const bcrypt = require('bcrypt');
const db = require('./db');

const registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (email.endsWith('@admin.com')) {
    return res.status(403).send({ message: 'Cannot register as admin via this endpoint' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send({ message: 'Error registering user' });
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'Email already registered' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(query, [fullName, email, hashedPassword, 'user'], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).send({ message: 'Error registering user' });
        }
        res.status(201).send({ message: 'User registered successfully' });
      });
    } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).send({ message: 'Error registering user' });
    }
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send({ message: 'Error logging in' });
    }

    if (results.length === 0) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).send({ message: 'Login successful', role: user.role });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error comparing passwords:', err);
      res.status(500).send({ message: 'Error logging in' });
    }
  });
};

module.exports = { registerUser, loginUser };
