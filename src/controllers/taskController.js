const taskService = require('../services/taskService');
const { ForeignKeyConstraintError, ValidationError } = require('sequelize');

class TaskController {
  async create(req, res, next) {
    try {
      const { title, description, status } = req.body;
      const projectId = req.params.projectId;

      if (!title) {
        const err = new Error('Task title is required');
        err.statusCode = 400;
        return next(err);
      }

      const task = await taskService.create({ title, description, status, ProjectId: projectId });
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError || error.message === 'Project not found') {
        const err = new Error('Project not found');
        err.statusCode = 404;
        next(err);
      } else if (error instanceof ValidationError) {
        const err = new Error(error.errors.map(e => e.message).join(', '));
        err.statusCode = 400;
        next(err);
      } else {
        next(error);
      }
    }
  }

  async update(req, res, next) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      if (task) {
        res.status(200).json(task);
      } else {
        const err = new Error('Task not found');
        err.statusCode = 404;
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await taskService.delete(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        const err = new Error('Task not found');
        err.statusCode = 404;
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
