const taskService = require('../services/taskService');

class TaskController {
  async create(req, res, next) {
    const { title, description, status } = req.body;
    const projectId = req.params.projectId;

    const task = await taskService.create({ title, description, status, ProjectId: projectId });
    res.status(201).json(task);
  }

  async findById(req, res, next) {
    const task = await taskService.findById(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      const err = new Error('Task not found');
      err.statusCode = 404;
      next(err);
    }
  }

  async findByProject(req, res, next) {
    const tasks = await taskService.findByProject(req.params.projectId);
    res.status(200).json(tasks);
  }

  async update(req, res, next) {
    const task = await taskService.update(req.params.id, req.body);
    if (task) {
      res.status(200).json(task);
    } else {
      const err = new Error('Task not found');
      err.statusCode = 404;
      next(err);
    }
  }

  async delete(req, res, next) {
    const result = await taskService.delete(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      const err = new Error('Task not found');
      err.statusCode = 404;
      next(err);
    }
  }
}

module.exports = new TaskController();
