const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: 'User registered successfully' });
});

// Task 2: Get the list of all books
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;  // Extract ISBN from request parameters
    
    // Find the book with the given ISBN
    const book = books.find(book => book.isbn === isbn);
    
    if (book) {
      res.status(200).json(book);  // Return the book details as JSON
    } else {
      res.status(404).json({ message: "Book not found" });  // Return error if book not found
    }
  });

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Task 4: Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.filter(b => b.author === author);
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'No books found by this author' });
  }
});

// Task 5: Get book details based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const bookByTitle = books.find(b => b.title === title);
  if (bookByTitle) {
    res.json(bookByTitle);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Task 6: Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  // Sample reviews data - Replace with actual data source
  const reviews = {
    '12345': [{ user: 'User1', review: 'Great book!' }],
    '67890': [{ user: 'User2', review: 'Interesting read.' }]
  };

  const bookReviews = reviews[isbn];
  if (bookReviews) {
    res.json(bookReviews);
  } else {
    res.status(404).json({ message: 'No reviews found for this book' });
  }
});

module.exports.general = public_users;
