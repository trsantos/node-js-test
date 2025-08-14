const Project = require('../models/project');

class ProjectRepository {
  async create(data) {
    return await Project.create(data);
  }

  async findAll() {
    return await Project.findAll();
  }

  async findById(id) {
    return await Project.findByPk(id);
  }

  async update(id, data) {
    const project = await Project.findByPk(id);
    if (project) {
      return await project.update(data);
    }
    return null;
  }

  async delete(id) {
    const project = await Project.findByPk(id);
    if (project) {
      await project.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new ProjectRepository();
