// loginRoute.js
const express = require('express');
const { loginUser } = require('./loginController');

const router = express.Router();

router.post('/login', loginUser);

module.exports = router;
