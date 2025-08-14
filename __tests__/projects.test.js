const request = require('supertest');
const app = require('../index');
const http = require('http');
const Project = require('../src/models/project');
const axios = require('axios');
const sequelize = require('../src/config/database');
const cache = require('../src/config/cache'); // Import cache for mocking

jest.mock('axios');
jest.mock('../src/config/cache'); // Mock the cache module

let server;
let projectId;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

beforeEach(async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.query('TRUNCATE TABLE Projects');
  await sequelize.query('TRUNCATE TABLE Tasks');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  const project = await Project.create({ name: 'Test Project', description: 'This is a test project.' });
  projectId = project.id;

  jest.clearAllMocks(); // Clear all mocks before each test

  // Mock cache behavior
  cache.get.mockResolvedValue(null); // By default, cache is empty
  cache.set.mockResolvedValue(true); // Cache set always succeeds

  axios.get.mockResolvedValue({
    data: [
      { name: 'repo1', description: 'desc1', html_url: 'url1' },
      { name: 'repo2', description: 'desc2', html_url: 'url2' },
    ],
  });
});

afterAll((done) => {
  server.close(done);
});

describe('Projects API', () => {
  it('should create a new project', async () => {
    const newProject = { name: 'Another Project', description: 'This is another test project.' };
    const response = await request(server)
      .post('/api/projects')
      .send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newProject.name);
    expect(response.body.description).toBe(newProject.description);
  });

  it('should fetch all projects', async () => {
    const response = await request(server).get('/api/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should fetch a project by ID', async () => {
    const response = await request(server).get(`/api/projects/${projectId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
  });

  it('should update a project', async () => {
    const updatedName = 'Updated Project Name';
    const response = await request(server)
      .put(`/api/projects/${projectId}`)
      .send({ name: updatedName });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedName);
  });

  it('should delete a project', async () => {
    const response = await request(server).delete(`/api/projects/${projectId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/projects/${projectId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should get GitHub repositories for a user', async () => {
    const username = 'octocat'; // Using a well-known GitHub user for testing
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(Array.isArray(response.body.githubRepos)).toBe(true);
  }, 20000);

  it('should handle GitHub API errors gracefully', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('GitHub API error')));
    const username = 'errorUser';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch GitHub repositories');
  });

  it('should return empty array if user has no public repositories', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: [] }));
    const username = 'userWithNoRepos';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(Array.isArray(response.body.githubRepos)).toBe(true);
    expect(response.body.githubRepos).toHaveLength(0);
  });
});
