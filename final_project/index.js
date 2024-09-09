const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, 'your-session-secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Store the decoded user information in the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
});

const PORT = 5000;

// Use routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
