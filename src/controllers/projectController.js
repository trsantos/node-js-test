const projectService = require('../services/projectService');

class ProjectController {
  async create(req, res) {
    try {
      const project = await projectService.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const projects = await projectService.findAll();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const project = await projectService.findById(req.params.id);
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await projectService.delete(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getGithubRepos(req, res) {
    try {
      const project = await projectService.getGithubRepos(req.params.id, req.params.username);
      res.status(200).json(project);
    } catch (error) {
      // Check if the error is from the GitHub API call
      if (error.message === 'GitHub API error') {
        res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new ProjectController();
