const taskRepository = require('../repositories/taskRepository');
const projectRepository = require('../repositories/projectRepository');

class TaskService {
  async create(data) {
    const project = await projectRepository.findById(data.ProjectId);
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    return await taskRepository.create(data);
  }

  async findById(id) {
    return await taskRepository.findById(id);
  }

  async update(id, data) {
    return await taskRepository.update(id, data);
  }

  async delete(id) {
    return await taskRepository.delete(id);
  }

  async findByProject(projectId) {
    return await taskRepository.findByProject(projectId);
  }
}

module.exports = new TaskService();
