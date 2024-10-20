const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '51036535',
  database: process.env.DB_NAME || 'credentials',
  port: process.env.DB_PORT || 3306,
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  });
};

// Function to upload a file to GitHub
const uploadFileToGitHub = async (fileContent, filePath) => {
  const content = Buffer.from(fileContent).toString('base64');
  const repo = 'M-Hunain5037/BookDatabase';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const response = await axios.put(url, {
    message: `Upload ${filePath}`,
    content: content,
  }, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.data.content.download_url;
};

// Endpoint to handle file uploads and save book details to the database
app.post('/api/upload/book', verifyToken, upload.fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, authors, description, genres, languages, tags } = req.body;
    const userId = req.userId;
    const userName = req.userName;

    const timestamp = Date.now();

    // Rename files using timestamp
    const bookFileName = `${timestamp}-${req.files['bookFile'][0].originalname}`;
    const coverFileName = `${timestamp}-${req.files['coverImageFile'][0].originalname}`;

    // Upload files to GitHub
    const bookFileUrl = await uploadFileToGitHub(req.files['bookFile'][0].buffer, `pdffile/${bookFileName}`);
    const coverImageUrl = await uploadFileToGitHub(req.files['coverImageFile'][0].buffer, `images/${coverFileName}`);

    const query = 'INSERT INTO books (title, authors, description, genres, languages, tags, cover_image_url, book_file_url, user_id, user_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, authors, description, genres, languages, tags, coverImageUrl, bookFileUrl, userId, userName, 'pending'];

    pool.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.status(200).json({ message: 'Book uploaded successfully', imgUrl: coverImageUrl, pdfUrl: bookFileUrl });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading book', error });
  }
});

// Fetch book statuses for the current user
app.get('/api/books/user/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT title, status FROM books WHERE user_id = ?';
  pool.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Fetch all books with optional filtering by tags, authors, genres, and languages
app.get('/api/books', verifyToken, (req, res) => {
  const { tags, authors, genres, languages, searchTerm } = req.query;
  let query = 'SELECT books.id, books.title, books.authors, books.status, books.book_file_url, books.cover_image_url, users.name as uploaded_by FROM books JOIN users ON books.user_id = users.id WHERE books.status = "approved"';
  let queryParams = [];

  if (tags) {
    const tagsArray = tags.split(',').map(tag => `%${tag.trim()}%`);
    query += ' AND (' + tagsArray.map(() => 'books.tags LIKE ?').join(' OR ') + ')';
    queryParams = queryParams.concat(tagsArray);
  }

  if (authors) {
    const authorsArray = authors.split(',').map(author => `%${author.trim()}%`);
    query += ' AND (' + authorsArray.map(() => 'books.authors LIKE ?').join(' OR ') + ')';
    queryParams = queryParams.concat(authorsArray);
  }

  if (genres) {
    const genresArray = genres.split(',').map(genre => `%${genre.trim()}%`);
    query += ' AND (' + genresArray.map(() => 'books.genres LIKE ?').join(' OR ') + ')';
    queryParams = queryParams.concat(genresArray);
  }

  if (languages) {
    const languagesArray = languages.split(',').map(language => `%${language.trim()}%`);
    query += ' AND (' + languagesArray.map(() => 'books.languages LIKE ?').join(' OR ') + ')';
    queryParams = queryParams.concat(languagesArray);
  }

  if (searchTerm) {
    query += ' AND LOWER(books.title) LIKE ?';
    queryParams.push(`%${searchTerm.toLowerCase().trim()}%`);
  }

  pool.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// Fetch all approved books
app.get('/api/books/approved', verifyToken, (req, res) => {
  const query = `
    SELECT books.id, books.title, books.authors, books.status, books.book_file_url, books.cover_image_url, users.name as uploaded_by
    FROM books
    JOIN users ON books.user_id = users.id
    WHERE books.status = "approved"
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// Fetch pending books
app.get('/api/books/pending', verifyToken, (req, res) => {
  const query = 'SELECT books.id, books.title, books.authors, books.status, books.book_file_url, books.cover_image_url, users.name as uploaded_by FROM books JOIN users ON books.user_id = users.id WHERE books.status = "pending"';

  pool.query(query, (err, results) => {
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
  pool.query(query, [status, bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Book status updated successfully' });
  });
});

// Fetch all languages
app.get('/api/languages', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT languages FROM books';

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.languages));
  });
});

// Fetch all genres
app.get('/api/genres', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT genres FROM books';

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.genres));
  });
});

// Fetch all authors
app.get('/api/authors', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT authors FROM books';

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results.map(row => row.authors));
  });
});

// Fetch all tags
app.get('/api/tags', verifyToken, (req, res) => {
  const query = 'SELECT DISTINCT tags FROM books';

  pool.query(query, (err, results) => {
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
  pool.query(query, [bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  });
});

// Endpoint to search books by title
app.get('/api/books/search', verifyToken, (req, res) => {
  const { title } = req.query;
  const query = 'SELECT id, title, cover_image_url FROM books WHERE title LIKE ? LIMIT 10';
  const values = [`%${title}%`];

  pool.query(query, values, (err, results) => {
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

  pool.query(query, [bookId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Fetch admin data
app.get('/api/auth/admin', verifyToken, (req, res) => {
  const adminId = req.userId;

  const query = 'SELECT id, name, email FROM users WHERE id = ?';
  pool.query(query, [adminId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(result[0]);
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  pool.query(query, [email], async (err, results) => {
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

    res.status(200).json({ token, role: user.role, userId: user.id, userName: user.name });
  });
});

// Add user endpoint (register)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body; 

  // Logging the request body to verify received data
  console.log('Received data:', req.body);

  // Validate the received data
  if (!name || !email || !password) { 
    console.error('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  pool.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      console.error('Validation error: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const addUserQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      pool.query(addUserQuery, [name, email, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Error inserting user' });
        }

        res.status(200).json({ id: result.insertId, name, email, role });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ message: 'Error processing request' });
    }
  });
});

// Fetch users endpoint
app.get('/api/users', verifyToken, (req, res) => {
  const query = 'SELECT id, name, email, role FROM users';

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Google Auth login endpoint
app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { fullName, email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    pool.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      let user;
      if (results.length === 0) {
        const addUserQuery = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
        pool.query(addUserQuery, [fullName, email, role || 'user'], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error inserting user' });
          }
          user = { id: result.insertId, name: fullName, email, role: role || 'user' };
          const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
          });

          return res.status(201).json({ token, role: user.role, userId: user.id, userName: user.name });
        });
      } else {
        user = results[0];
        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1h',
        });

        return res.status(200).json({ token, role: user.role, userId: user.id, userName: user.name });
      }
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch user profile and their uploaded books
app.get('/api/users/:userId/profile', verifyToken, (req, res) => {
  const userId = req.params.userId;

  // First, fetch user details
  const userQuery = 'SELECT id, name, email FROM users WHERE id = ?';
  pool.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the books uploaded by the user
    const booksQuery = 'SELECT id, title, cover_image_url FROM books WHERE user_id = ? AND status = "approved"';
    pool.query(booksQuery, [userId], (err, booksResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      // Combine user details and books into a single response
      const userProfile = {
        ...userResult[0],
        uploadedBooks: booksResult
      };

      res.status(200).json(userProfile);
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
