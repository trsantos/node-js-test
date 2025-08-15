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
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newProject.name);
    expect(response.body.description).toBe(newProject.description);
  });

  it('should fetch all projects', async () => {
    await Project.create({ name: 'Project 1', description: '...' }); // Create a project for this test
    const response = await request(server).get('/api/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should fetch a project by ID', async () => {
    const newProject = {
      name: 'Project to Fetch via API',
      description: 'This project is created via API.',
    };
    const createResponse = await request(server).post('/api/projects').send(newProject);

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id;

    const response = await request(server).get(`/api/projects/${projectId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body.name).toBe(newProject.name);
  });

  it('should update a project', async () => {
    const project = await Project.create({ name: 'Project to Update', description: '...' });
    const projectId = project.id;
    const updatedName = 'Updated Project Name';
    const response = await request(server)
      .put(`/api/projects/${projectId}`)
      .send({ name: updatedName });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedName);
  });

  it('should delete a project', async () => {
    const project = await Project.create({ name: 'Project to Delete', description: '...' });
    const projectId = project.id;
    const response = await request(server).delete(`/api/projects/${projectId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/projects/${projectId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should get GitHub repositories for a user', async () => {
    const project = await Project.create({ name: 'Project for GitHub Repos', description: '...' });
    const projectId = project.id;
    const username = 'octocat'; // Using a well-known GitHub user for testing
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(Array.isArray(response.body.githubRepos)).toBe(true);
  }, 20000);

  it('should handle GitHub API errors gracefully', async () => {
    const project = await Project.create({ name: 'Project for GitHub Error', description: '...' });
    const projectId = project.id;
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('GitHub API error')));
    const username = 'errorUser';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toHaveProperty('message', 'Failed to fetch GitHub repositories');
  });

  it('should return empty array if user has no public repositories', async () => {
    const project = await Project.create({ name: 'Project for No Repos', description: '...' });
    const projectId = project.id;
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: [] }));
    const username = 'userWithNoRepos';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(Array.isArray(response.body.githubRepos)).toBe(true);
    expect(response.body.githubRepos).toHaveLength(0);
  });

  // New tests for error handling and edge cases
  it('should return 400 if creating a project with missing name', async () => {
    const newProject = { description: 'Project without a name.' };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(400); // Assuming 400 for bad request due to validation
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Project name is required');
  });

  it('should return 404 if fetching a non-existent project by ID', async () => {
    const nonExistentId = projectId + 999; // A likely non-existent ID
    const response = await request(server).get(`/api/projects/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Project not found');
  });

  it('should return 404 if updating a non-existent project', async () => {
    const nonExistentId = projectId + 999;
    const response = await request(server)
      .put(`/api/projects/${nonExistentId}`)
      .send({ name: 'Non Existent Project' });

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Project not found');
  });

  it('should return 404 if deleting a non-existent project', async () => {
    const nonExistentId = projectId + 999;
    const response = await request(server).delete(`/api/projects/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Project not found');
  });

  it('should use cache when fetching GitHub repositories if data is available', async () => {
    const project = await Project.create({ name: 'Project for Cached Repos', description: '...' });
    const projectId = project.id;
    const cachedRepos = [{ name: 'cached-repo', description: 'from cache', url: 'cached-url' }];
    cache.get.mockResolvedValueOnce(JSON.stringify(cachedRepos)); // Simulate cache hit

    const username = 'cachedUser';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(response.body.githubRepos).toEqual(cachedRepos);
    expect(cache.get).toHaveBeenCalledWith(`github:${username}`);
    expect(axios.get).not.toHaveBeenCalled(); // axios.get should not be called on cache hit
  });

  it('should call axios.get and set cache when fetching GitHub repositories if cache is empty', async () => {
    const project = await Project.create({ name: 'Project for New Repos', description: '...' });
    const projectId = project.id;
    cache.get.mockResolvedValueOnce(null); // Simulate cache miss
    // Mock data should have html_url as projectService maps it
    const newReposFromGithub = [
      { name: 'new-repo', description: 'new from github', html_url: 'new-url' },
    ];
    const expectedReposInResponse = [
      { name: 'new-repo', description: 'new from github', url: 'new-url' },
    ]; // What the service returns after mapping
    axios.get.mockResolvedValueOnce({ data: newReposFromGithub });

    const username = 'newUser';
    const response = await request(server).get(`/api/projects/${projectId}/github/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('githubRepos');
    expect(response.body.githubRepos).toEqual(expectedReposInResponse);
    expect(cache.get).toHaveBeenCalledWith(`github:${username}`);
    expect(axios.get).toHaveBeenCalledTimes(1); // axios.get should be called
    expect(cache.set).toHaveBeenCalledTimes(1); // cache.set should be called
  });
});
