const path = require('path');
const sequelize = require(path.resolve(__dirname, '../src/config/database'));

module.exports = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
};
