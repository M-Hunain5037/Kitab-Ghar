const bcrypt = require('bcrypt');
const { db } = require('./db');

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
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
        res.status(200).send({ message: 'Login successful', role: user.role, role_id: user.role_id });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error comparing passwords:', err);
      res.status(500).send({ message: 'Error logging in' });
    }
  });
};

module.exports = { loginUser };
