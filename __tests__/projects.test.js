const request = require('supertest');
const sequelize = require('../src/config/database');
const app = require('../index');

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll((done) => {
  sequelize.close();
  done();
});

describe('Projects API', () => {
  it('should fetch all projects', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
