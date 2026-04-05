const express = require('express');
const router  = express.Router();
const { updateTask, moveTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/:id',       updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id',    deleteTask);

module.exports = router;