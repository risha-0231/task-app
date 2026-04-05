const Board = require('../models/Board');
const Task  = require('../models/Task');

const DEFAULT_COLUMNS = [
  { id: 'todo',        title: 'To Do',       order: 0 },
  { id: 'in-progress', title: 'In Progress',  order: 1 },
  { id: 'done',        title: 'Done',         order: 2 },
];

// GET /api/boards
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort('-createdAt');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/boards
const createBoard = async (req, res) => {
  const { title } = req.body;
  try {
    const board = await Board.create({
      title,
      owner: req.user._id,
      columns: DEFAULT_COLUMNS,
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boards/:id
const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id:   req.params.id,
      owner: req.user._id,
    });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/boards/:id
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title: req.body.title },
      { new: true }
    );
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id:   req.params.id,
      owner: req.user._id,
    });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Also delete all tasks belonging to this board
    await Task.deleteMany({ board: req.params.id });
    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBoards, createBoard, getBoard, updateBoard, deleteBoard };