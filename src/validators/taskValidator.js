const { body } = require('express-validator');

const createTaskValidation = [
  body('title').notEmpty().withMessage('Task title is required').trim().escape(),
  body('description').optional().trim().escape(),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status value'),
];

const updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Task title cannot be empty').trim().escape(),
  body('description').optional().trim().escape(),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status value'),
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
};
