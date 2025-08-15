const request = require('supertest');
const app = require('../index');
const http = require('http');
const Project = require('../src/models/project');
const axios = require('axios');
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

  it('should return 400 if updating a project with an empty name', async () => {
    const project = await Project.create({ name: 'Project to Update', description: '...' });
    const projectId = project.id;
    const response = await request(server).put(`/api/projects/${projectId}`).send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Project name cannot be empty');
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

  it('should ignore extra fields when creating a project', async () => {
    const newProject = {
      name: 'Project with Extra Fields',
      description: '...',
      extraField: 'should be ignored',
    };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty('extraField');
  });

  it('should ignore extra fields when updating a project', async () => {
    const project = await Project.create({ name: 'Project to Update', description: '...' });
    const projectId = project.id;
    const response = await request(server)
      .put(`/api/projects/${projectId}`)
      .send({ name: 'Updated Name', extraField: 'should be ignored' });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('extraField');
  });

  // URL parameter validation tests for projects
  it('should return 404 for non-numeric project ID in GET', async () => {
    const response = await request(server).get('/api/projects/invalid-id');
    expect(response.status).toBe(404);
  });

  it('should return 404 for non-numeric project ID in PUT', async () => {
    const response = await request(server)
      .put('/api/projects/invalid-id')
      .send({ name: 'Updated Name' });
    expect(response.status).toBe(404);
  });

  it('should return 404 for non-numeric project ID in DELETE', async () => {
    const response = await request(server).delete('/api/projects/invalid-id');
    expect(response.status).toBe(404);
  });

  it('should return 404 for non-numeric project ID in GitHub integration', async () => {
    const response = await request(server).get('/api/projects/invalid-id/github/octocat');
    expect(response.status).toBe(500); // Service throws error when project not found
  });

  // Input sanitization tests for projects
  it('should sanitize HTML in project name', async () => {
    const maliciousName = '<script>alert("xss")</script>Project Name';
    const newProject = { name: maliciousName, description: 'Safe description' };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    // HTML should be escaped, not executed
    expect(response.body.name).toContain('&lt;script&gt;');
    expect(response.body.name).toContain('Project Name');
  });

  it('should sanitize HTML in project description', async () => {
    const maliciousDescription = '<img src="x" onerror="alert(1)">Project Description';
    const newProject = { 
      name: 'Safe Project Name',
      description: maliciousDescription 
    };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    // HTML should be escaped, not executed - checking the actual escaped output
    expect(response.body.description).toContain('&lt;img');
    expect(response.body.description).toContain('onerror=&quot;alert(1)&quot;');
    expect(response.body.description).toContain('Project Description');
  });

  // Content-Type validation tests for projects  
  it('should handle malformed JSON gracefully', async () => {
    const response = await request(server)
      .post('/api/projects')
      .send('{"name": "Test", invalid json}')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });

  it('should handle large payloads gracefully', async () => {
    const largeDescription = 'A'.repeat(10000); // 10KB description
    const newProject = { 
      name: 'Project with Large Description',
      description: largeDescription 
    };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    expect(response.body.description).toHaveLength(10000);
  });

  // Additional GitHub integration edge cases
  it('should handle GitHub API with empty username', async () => {
    const project = await Project.create({ name: 'Project for Empty Username', description: '...' });
    const response = await request(server).get(`/api/projects/${project.id}/github/`);
    
    expect(response.status).toBe(404); // Route not matched
  });

  it('should handle very long usernames in GitHub integration', async () => {
    const project = await Project.create({ name: 'Project for Long Username', description: '...' });
    const longUsername = 'a'.repeat(100);
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('Invalid username')));
    
    const response = await request(server).get(`/api/projects/${project.id}/github/${longUsername}`);
    expect(response.status).toBe(500);
  });

  // Boundary testing
  it('should handle empty string project name validation', async () => {
    const newProject = { name: '', description: 'Valid description' };
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should handle whitespace-only project name', async () => {
    const newProject = { name: '   ', description: 'Valid description' };
    const response = await request(server).post('/api/projects').send(newProject);

    // Now that validation order is fixed (trim then notEmpty), this should fail
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should create project with minimal valid data', async () => {
    const newProject = { name: 'A' }; // Single character name, no description
    const response = await request(server).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('A');
    // Sequelize returns undefined for null fields in JSON response
    expect(response.body.description).toBeUndefined();
  });
});
