// User-related routes and operations
const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Database connection
const jwt = require('jsonwebtoken'); // JSON Web Token for authentication

const SECRET_KEY = "your_secret_key";

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const emailCheckQuery = `SELECT * FROM Users WHERE Email = ?`;
        const [existingUser] = await pool.query(emailCheckQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        const query = `INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)`;
        await pool.query(query, [name, email, password]);

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// User login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }
  
    try {
      const query = `SELECT * FROM Users WHERE Email = ?`;
      const [results] = await pool.query(query, [email]);
  
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const user = results[0];
  
      if (password !== user.Password) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      const token = jwt.sign(
        { userID: user.UserID, email: user.Email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error." });
    }
});

// Get user details for "My Account"
router.get('/MyAccount', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const query = `
          SELECT 
            Name, 
            Email, 
            Gender, 
            Country, 
            DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS DateOfBirth, 
            TimeZone 
          FROM Users 
          WHERE Email = ?;
        `;
        const [results] = await pool.query(query, [userEmail]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Update user account details
router.put('/MyAccount', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const { Name, Gender, Country, DateOfBirth, TimeZone } = req.body;

        if (!Name || !Gender || !Country || !DateOfBirth || !TimeZone) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const query = `
            UPDATE Users
            SET 
                Name = ?, 
                Gender = ?, 
                Country = ?, 
                DateOfBirth = ?, 
                TimeZone = ?
            WHERE Email = ?;
        `;

        const [result] = await pool.query(query, [
            Name, Gender, Country, DateOfBirth, TimeZone, userEmail
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Details updated successfully.' });
    } catch (err) {
        console.error('Error updating account details:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get user points
router.get('/points', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const query = `SELECT PointsBalance FROM Users WHERE Email = ?`;
        const [results] = await pool.query(query, [userEmail]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ pointsBalance: results[0].PointsBalance });
    } catch (err) {
        console.error('Error fetching points balance:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get details of a specific user by ID
router.get('/:userId', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const query = `SELECT * FROM Users WHERE UserID = ?`;
        const [results] = await pool.query(query, [req.params.userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get user points
router.get('/points', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const query = `SELECT PointsBalance FROM Users WHERE Email = ?`;
        const [results] = await pool.query(query, [userEmail]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ pointsBalance: results[0].PointsBalance });
    } catch (err) {
        console.error('Error fetching points balance:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
