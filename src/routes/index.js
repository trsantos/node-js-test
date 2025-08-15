const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const {
  createProjectValidation,
  updateProjectValidation,
} = require('../validators/projectValidator');
const { createTaskValidation, updateTaskValidation } = require('../validators/taskValidator');
const handleValidationErrors = require('../middleware/validationHandler');

// Project routes
router.post('/projects', createProjectValidation, handleValidationErrors, projectController.create);
router.get('/projects', projectController.findAll);
router.get('/projects/:id', projectController.findById);
router.put('/projects/:id', updateProjectValidation, handleValidationErrors, projectController.update);
router.delete('/projects/:id', projectController.delete);
router.get('/projects/:id/github/:username', projectController.getGithubRepos);

// Task routes
router.post(
  '/projects/:projectId/tasks',
  createTaskValidation,
  handleValidationErrors,
  taskController.create
);
router.get('/projects/:projectId/tasks', taskController.findByProject);
router.get('/tasks/:id', taskController.findById);
router.put('/tasks/:id', updateTaskValidation, handleValidationErrors, taskController.update);
router.delete('/tasks/:id', taskController.delete);

module.exports = router;
