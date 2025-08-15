const taskService = require('../services/taskService');
const { ForeignKeyConstraintError, ValidationError } = require('sequelize');

class TaskController {
  async create(req, res, next) {
    const { title, description, status } = req.body;
    const projectId = req.params.projectId;

    taskService
      .create({ title, description, status, ProjectId: projectId })
      .then((task) => res.status(201).json(task))
      .catch((error) => {
        if (error instanceof ForeignKeyConstraintError || error.message === 'Project not found') {
          const err = new Error('Project not found');
          err.statusCode = 404;
          return next(err);
        }
        if (error instanceof ValidationError) {
          const err = new Error(error.errors.map((e) => e.message).join(', '));
          err.statusCode = 400;
          return next(err);
        }
        next(error);
      });
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
