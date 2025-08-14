const request = require('supertest');
const app = require('../index');
const http = require('http');
const Project = require('../src/models/project');
const axios = require('axios');
const sequelize = require('../src/config/database');

jest.mock('axios');

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe('Projects API', () => {
  it('should fetch all projects', async () => {
    const response = await request(server).get('/api/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
