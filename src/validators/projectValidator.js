const { body } = require('express-validator');

const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required').escape(),
  body('description').optional().trim().escape(),
];

const updateProjectValidation = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty').escape(),
  body('description').optional().trim().escape(),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};
