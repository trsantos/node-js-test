const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./project');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
  },
});

Project.hasMany(Task);
Task.belongsTo(Project);

module.exports = Task;
