const { db } = require('./db');

const authenticateUser = (req, res, next) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send({ message: 'Authentication failed' });
    }

    const user = results[0];
    req.user = user;
    next();
  });
};

module.exports = { authenticateUser };
