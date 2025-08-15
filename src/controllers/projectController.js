const projectService = require('../services/projectService');

class ProjectController {
  async create(req, res, next) {
    const { name, description } = req.body;
    if (!name) {
      const err = new Error('Project name is required');
      err.statusCode = 400;
      return next(err);
    }
    const project = await projectService.create({ name, description });
    res.status(201).json(project);
  }

  async findAll(req, res, next) {
    const projects = await projectService.findAll();
    res.status(200).json(projects);
  }

  async findById(req, res, next) {
    const project = await projectService.findById(req.params.id);
    if (project) {
      res.status(200).json(project);
    } else {
      const err = new Error('Project not found');
      err.statusCode = 404;
      next(err);
    }
  }

  async update(req, res, next) {
    const project = await projectService.update(req.params.id, req.body);
    if (project) {
      res.status(200).json(project);
    } else {
      const err = new Error('Project not found');
      err.statusCode = 404;
      next(err);
    }
  }

  async delete(req, res, next) {
    const result = await projectService.delete(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      const err = new Error('Project not found');
      err.statusCode = 404;
      next(err);
    }
  }

  async getGithubRepos(req, res, next) {
    const project = await projectService.getGithubRepos(req.params.id, req.params.username);
    res.status(200).json(project);
  }
}

module.exports = new ProjectController();
