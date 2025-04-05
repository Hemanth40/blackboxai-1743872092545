require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Skipping database connection for initial run
console.log('Running without database connection');

// In-memory data storage
const tempData = {
  issues: [],
  users: [],
  volunteers: [],
  projects: []
};

// Make tempData available to routes
app.set('tempData', tempData);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Community Bridge API' });
});

// Import route files
const issueRoutes = require('./routes/issues');
const userRoutes = require('./routes/users');
const volunteerRoutes = require('./routes/volunteers');
const projectRoutes = require('./routes/projects');

// Use routes
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/projects', projectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;