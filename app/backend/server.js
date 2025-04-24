// Load environment variables from .env (MongoDB connection string)
require('dotenv').config();

// Import Express framework and MongoDB connection logic
const express = require('express');
const connectDB = require('./config/db');

// Create an instance of an Express application
const app = express();

// Connect to MongoDB using Mongoose
// This uses the MONGO_URI defined in the .env file
connectDB();

// Tells Express to automatically parse incoming JSON in requests
app.use(express.json());

// ROUTES
// All endpoints related to menus will be handled in menuRoutes.js
// For example: GET /api/menus or POST /api/menus
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menus', menuRoutes);

const menuItemRoutes = require('./routes/menuItemsRoutes');
app.use('/api', menuItemRoutes);

const authRoutes = require('./routes/user.routes');
app.use('/api/auth', authRoutes);

// You can test this by visiting http://localhost:5000/
app.get('/', (req, res) => {
  res.send('NomNomSafe API is running');
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
