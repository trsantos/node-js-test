const taskService = require('../services/taskService');

class TaskController {
  async create(req, res) {
    try {
      const task = await taskService.create({ ...req.body, ProjectId: req.params.projectId });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
