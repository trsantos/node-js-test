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
    let project = await projectRepository.findById(projectId); // Fetch project once
    if (!project) {
      throw new Error('Project not found');
    }

    let repos = await cache.get(cacheKey);

    if (repos) { // If cache hit, parse it immediately
      repos = JSON.parse(repos);
    } else { // If cache miss
      const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
      repos = response.data.map(repo => ({ name: repo.name, description: repo.description, url: repo.html_url }));
      await cache.set(cacheKey, JSON.stringify(repos), 'EX', 600);

      // Update project in DB only if new repos were fetched
      await projectRepository.update(projectId, { githubRepos: repos });
    }

    project.githubRepos = repos; // 'repos' is guaranteed to be a JavaScript array/object here
    return project;
  }
}

module.exports = new ProjectService();
