require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Directly require the model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with retry logic
const connectWithRetry = () => {
  const mongoUri = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
  
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Connected to MongoDB at ${process.env.DB_HOST}`))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Simple in-memory cache for tasks
let taskCache = [];

// Routes
app.get('/', async (req, res) => {
  try {
    if (taskCache.length === 0) {
      taskCache = await Task.find();
    }
    res.render('index', { tasks: taskCache });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).send('Database error');
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    await newTask.save();
    taskCache = await Task.find(); // Update cache
    res.redirect('/');
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).send('Error creating task');
  }
});

// Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
