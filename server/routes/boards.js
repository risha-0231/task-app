const express = require('express');
const router  = express.Router();
const {
  getBoards, createBoard, getBoard, updateBoard, deleteBoard,
} = require('../controllers/boardController');
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All board routes require login

router.get('/',           getBoards);
router.post('/',          createBoard);
router.get('/:id',        getBoard);
router.put('/:id',        updateBoard);
router.delete('/:id',     deleteBoard);

// Tasks nested under a board
router.get('/:boardId/tasks',  getTasks);
router.post('/:boardId/tasks', createTask);

module.exports = router;