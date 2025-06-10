require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 3000;

// Debugging logs - REMOVE AFTER CONFIRMING IT WORKS
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Resolved views path:', path.join(process.cwd(), 'app', 'views'));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'app', 'views')); // Corrected path
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with retry logic
const connectWithRetry = () => {
  const mongoUri = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

  console.log('Connecting to MongoDB with URI:', mongoUri);
  
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
    console.log('Fetching tasks...');
    if (taskCache.length === 0) {
      taskCache = await Task.find();
      console.log(`Loaded ${taskCache.length} tasks from database`);
    }
    res.render('index', { tasks: taskCache });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).send('Database error');
  }
});

app.post('/tasks', async (req, res) => {
  try {
    console.log('Creating new task:', req.body.title);
    const newTask = new Task({ title: req.body.title });
    await newTask.save();
    taskCache = await Task.find(); // Update cache
    console.log('Task created. Total tasks:', taskCache.length);
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
