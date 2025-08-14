const Task = require('../models/task');

class TaskRepository {
  async create(data) {
    return await Task.create(data);
  }

  async findById(id) {
    return await Task.findByPk(id);
  }

  async update(id, data) {
    const task = await Task.findByPk(id);
    if (task) {
      return await task.update(data);
    }
    return null;
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new TaskRepository();
