const { body } = require('express-validator');

const createProjectValidation = [
  body('name').notEmpty().withMessage('Project name is required').trim().escape(),
  body('description').optional().trim().escape(),
];

const updateProjectValidation = [
  body('name').optional().notEmpty().withMessage('Project name cannot be empty').trim().escape(),
  body('description').optional().trim().escape(),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};
