const projectRepository = require('../repositories/projectRepository');
const cache = require('../config/cache');
const axios = require('axios');

class ProjectService {
  async create(data) {
    return await projectRepository.create(data);
  }

  async findAll() {
    return await projectRepository.findAll();
  }

  async findById(id) {
    return await projectRepository.findById(id);
  }

  async update(id, data) {
    return await projectRepository.update(id, data);
  }

  async delete(id) {
    return await projectRepository.delete(id);
  }

    async getGithubRepos(projectId, username) {
    const cacheKey = `github:${username}`;
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const cachedRepos = await cache.get(cacheKey);
    if (cachedRepos) {
      project.githubRepos = JSON.parse(cachedRepos);
      return project;
    }

    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
      const repos = response.data.map(repo => ({ name: repo.name, description: repo.description, url: repo.html_url }));
      await cache.set(cacheKey, JSON.stringify(repos), 'EX', 600);
      await projectRepository.update(projectId, { githubRepos: repos });
      project.githubRepos = repos;
      return project;
    } catch (error) {
      const err = new Error('Failed to fetch GitHub repositories');
      err.statusCode = 500;
      throw err;
    }
  }
}

module.exports = new ProjectService();
