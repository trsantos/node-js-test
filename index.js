const express = require('express');
const sequelize = require('./src/config/database');
const routes = require('./src/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});
