const taskRepository = require('../repositories/taskRepository');

class TaskService {
  async create(data) {
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
}

module.exports = new TaskService();
