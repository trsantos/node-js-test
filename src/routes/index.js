const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

// Project routes
router.post('/projects', projectController.create);
router.get('/projects', projectController.findAll);
router.get('/projects/:id', projectController.findById);
router.put('/projects/:id', projectController.update);
router.delete('/projects/:id', projectController.delete);
router.get('/projects/:id/github/:username', projectController.getGithubRepos);

// Task routes
router.post('/projects/:projectId/tasks', taskController.create);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);

module.exports = router;
