const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "bookFile" || file.fieldname === "coverImageFile") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  }
}).fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImageFile', maxCount: 1 }
]);

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    req.userId = decoded.id;
    req.userName = decoded.name; // Assuming name is included in the token payload
    next();
  });
};

// Database connection setup
const dbCredentials = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
dbCredentials.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Endpoint to handle file uploads and save book details to the database
app.post('/api/upload/book', verifyToken, (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Multer error', error: err });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error', error: err });
    }

    const bookFileUrl = `/uploads/${req.files['bookFile'][0].filename}`;
    const coverImageUrl = `/uploads/${req.files['coverImageFile'][0].filename}`;
    const { title, authors, description, genres, languages, tags } = req.body;
    const userId = req.userId;
    const userName = req.userName;

    const query = 'INSERT INTO books (title, authors, description, genres, languages, tags, cover_image_url, book_file_url, user_id, user_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, authors, description, genres, languages, tags, coverImageUrl, bookFileUrl, userId, userName, 'pending'];

    dbCredentials.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.status(200).json({ message: 'Book uploaded successfully', imgUrl: coverImageUrl, pdfUrl: bookFileUrl });
    });
  });
});

// Endpoint to fetch book statuses for the current user
app.get('/api/books/user/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT title, status FROM books WHERE user_id = ?';
  dbCredentials.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Serve the uploaded files
app.use('/uploads', express.static('uploads'));

// Fetch users endpoint
app.get('/api/users', verifyToken, (req, res) => {
  const query = 'SELECT id, name, email, role FROM users';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Fetch admin data
app.get('/api/auth/admin', verifyToken, (req, res) => {
  const adminId = req.userId;

  const query = 'SELECT id, name, email FROM users WHERE id = ?';
  dbCredentials.query(query, [adminId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(result[0]);
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  dbCredentials.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, role: user.role, userId: user.id, userName: user.name }); // Add userId and userName to the response
  });
});

// Add user endpoint (register)
app.post('/api/auth/register', verifyToken, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  dbCredentials.query(checkUserQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const addUserQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    dbCredentials.query(addUserQuery, [name, email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      res.status(200).json({ id: result.insertId, name, email, role });
    });
  });
});

// Endpoint to fetch all books
app.get('/api/books', verifyToken, (req, res) => {
  const query = 'SELECT books.id, books.title, books.authors, books.status, books.book_file_url, books.cover_image_url, users.name as uploaded_by FROM books JOIN users ON books.user_id = users.id WHERE books.status = "pending"';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// Endpoint to fetch all approved books
app.get('/api/books/approved', verifyToken, (req, res) => {
  const query = 'SELECT books.id, books.title, books.authors, books.status, books.book_file_url, books.cover_image_url, users.name as uploaded_by FROM books JOIN users ON books.user_id = users.id WHERE books.status = "approved"';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// Update book status
app.put('/api/books/:id', verifyToken, (req, res) => {
  const bookId = req.params.id;
  const { status } = req.body;

  const query = 'UPDATE books SET status = ? WHERE id = ?';
  dbCredentials.query(query, [status, bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Book status updated successfully' });
  });
});

// Endpoint to fetch all languages
app.get('/api/languages', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT languages FROM books';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.languages));
  });
});

// Endpoint to fetch all genres
app.get('/api/genres', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT genres FROM books';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.genres));
  });
});

// Endpoint to fetch all authors
app.get('/api/authors', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT authors FROM books';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.authors));
  });
});

// Endpoint to fetch all tags
app.get('/api/tags', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT tags FROM books';

  dbCredentials.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.tags));
  });
});

// Delete book endpoint
app.delete('/api/books/:id', verifyToken, (req, res) => {
  const bookId = req.params.id;

  const query = 'DELETE FROM books WHERE id = ?';
  dbCredentials.query(query, [bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  });
});

// Serve the uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to search books by title
app.get('/api/books/search', verifyToken, (req, res) => {
  const { title } = req.query;
  const query = 'SELECT id, title, cover_image_url FROM books WHERE title LIKE ? LIMIT 10';
  const values = [`%${title}%`];

  dbCredentials.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// Endpoint to fetch book details by ID
app.get('/api/books/:id', verifyToken, (req, res) => {
  const bookId = req.params.id;
  const query = 'SELECT * FROM books WHERE id = ?';

  dbCredentials.query(query, [bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
