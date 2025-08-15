const { ValidationError, ForeignKeyConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    const message = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({ error: { message } });
  }

  if (err instanceof ForeignKeyConstraintError) {
    const field = err.fields?.join(', ') || 'related resource';
    const message = `The specified ${field} does not exist.`;
    return res.status(404).json({ error: { message } });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
};

module.exports = errorHandler;
