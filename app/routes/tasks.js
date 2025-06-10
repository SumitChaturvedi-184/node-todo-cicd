const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST create new task
router.post('/tasks', async (req, res) => {
  const task = new Task({ title: req.body.title });
  try {
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;