require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Production-ready)
const mongoUri = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  socketTimeoutMS: 30000, // 30 seconds timeout
  connectTimeoutMS: 30000
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB at ${process.env.DB_HOST}`);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit app on connection failure
});

// Routes
app.use('/', taskRoutes);

// Server
app.listen(config.app.port, () => {
  console.log(`Server running on http://localhost:${config.app.port}`);
});