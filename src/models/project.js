const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  githubRepos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
});

module.exports = Project;
