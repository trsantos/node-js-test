const { body } = require('express-validator');

const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name must be between 1 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_.!?()]+$/)
    .withMessage('Project name contains invalid characters')
    .escape(),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .escape(),
];

const updateProjectValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name must be between 1 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_.!?()]+$/)
    .withMessage('Project name contains invalid characters')
    .escape(),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .escape(),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};
