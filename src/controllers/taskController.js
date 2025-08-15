const taskService = require('../services/taskService');
const { ForeignKeyConstraintError, ValidationError } = require('sequelize'); // Import specific Sequelize errors

class TaskController {
  async create(req, res) {
    try {
      const { title, description, status } = req.body;
      const projectId = req.params.projectId;

      if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
      }

      const task = await taskService.create({ title, description, status, ProjectId: projectId });
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: 'Project not found' });
      } else if (error instanceof ValidationError) {
        // For validation errors, extract messages and return 400
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else if (error.message === 'Project not found') { // Fallback for custom error
        res.status(404).json({ message: 'Project not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await taskService.delete(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
