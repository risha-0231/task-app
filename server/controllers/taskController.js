const Task = require('../models/Task');
const Board = require('../models/Board');

// GET /api/boards/:boardId/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId }).sort('order');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/boards/:boardId/tasks
const createTask = async (req, res) => {
  const { title, description, columnId, priority, label, dueDate } = req.body;
  try {
    // Find the highest order value in this column so new task goes to the bottom
    const lastTask = await Task.findOne({
      board: req.params.boardId,
      columnId,
    }).sort('-order');

    const task = await Task.create({
      title,
      description,
      board:    req.params.boardId,
      columnId,
      priority,
      label,
      dueDate,
      order: lastTask ? lastTask.order + 1 : 0,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/tasks/:id/move  — called when user drags a card
const moveTask = async (req, res) => {
  const { columnId, order } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { columnId, order },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, moveTask, deleteTask };