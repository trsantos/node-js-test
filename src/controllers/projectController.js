const projectService = require('../services/projectService');

class ProjectController {
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      if (!name) {
        const err = new Error('Project name is required');
        err.statusCode = 400;
        return next(err);
      }
      const project = await projectService.create({ name, description });
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const projects = await projectService.findAll();
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const project = await projectService.findById(req.params.id);
      if (project) {
        res.status(200).json(project);
      } else {
        const err = new Error('Project not found');
        err.statusCode = 404;
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      if (project) {
        res.status(200).json(project);
      } else {
        const err = new Error('Project not found');
        err.statusCode = 404;
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await projectService.delete(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        const err = new Error('Project not found');
        err.statusCode = 404;
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }

  async getGithubRepos(req, res, next) {
    try {
      const project = await projectService.getGithubRepos(req.params.id, req.params.username);
      res.status(200).json(project);
    } catch (error) {
      if (error.message === 'GitHub API error') {
        const err = new Error('Failed to fetch GitHub repositories');
        err.statusCode = 500;
        next(err);
      } else {
        next(error);
      }
    }
  }
}

module.exports = new ProjectController();
