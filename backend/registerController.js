const bcrypt = require('bcrypt');
const { db } = require('./db');

const registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  // Ensure that the registration is for a normal user
  if (email.endsWith('@admin.com')) {
    return res.status(403).send({ message: 'Cannot register as admin via this endpoint' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      res.status(500).send({ message: 'Error registering user' });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ message: 'Email already registered' });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(query, [fullName, email, hashedPassword, 'user'], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).send({ message: 'Error registering user' });
          return;
        }

        const roleId = result.insertId;
        const roleIdUpdateQuery = 'UPDATE users SET role_id = ? WHERE id = ?';
        
        db.query(roleIdUpdateQuery, [roleId, result.insertId], (err, result) => {
          if (err) {
            console.error('Error setting role ID:', err);
            res.status(500).send({ message: 'Error setting role ID' });
            return;
          }
          res.status(201).send({ message: 'User registered successfully' });
        });
      });
    } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).send({ message: 'Error registering user' });
    }
  });
};

module.exports = { registerUser };
