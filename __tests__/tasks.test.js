const request = require('supertest');
const app = require('../index');
const http = require('http');
const Project = require('../src/models/project');
const Task = require('../src/models/task');
const sequelize = require('../src/config/database');

let server;
let projectId;
let taskId;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

beforeEach(async () => {
  // Ensure database is ready and clear mocks
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for database readiness
  jest.clearAllMocks(); // Clear all mocks before each test
});

afterAll((done) => {
  server.close(done);
});

describe('Tasks API', () => {
  it('should create a new task for a project', async () => {
    const project = await Project.create({ name: 'Project for New Task', description: '...' });
    const projectId = project.id;
    const newTask = { title: 'Another Task', description: 'This is another test task.' };
    const response = await request(server)
      .post(`/api/projects/${projectId}/tasks`)
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
    expect(Number(response.body.ProjectId)).toEqual(projectId);
  });

  it('should update a task', async () => {
    const task = await Task.create({ title: 'Task to Update', description: '...', ProjectId: projectId });
    const taskId = task.id;
    const updatedTitle = 'Updated Task Title';
    const response = await request(server)
      .put(`/api/tasks/${taskId}`)
      .send({ title: updatedTitle });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTitle);
  });

  it('should delete a task', async () => {
    const task = await Task.create({ title: 'Task to Delete', description: '...', ProjectId: projectId });
    const taskId = task.id;
    const response = await request(server).delete(`/api/tasks/${taskId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/tasks/${taskId}`);
    expect(getResponse.status).toBe(404);
  });

  // New tests for error handling and edge cases
  it('should return 404 if creating a task for a non-existent project', async () => {
    const nonExistentProjectId = projectId + 999;
    const newTask = { title: 'Task for non-existent project', description: '...' };
    const response = await request(server)
      .post(`/api/projects/${nonExistentProjectId}/tasks`)
      .send(newTask);

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Project not found');
  });

  it('should return 400 if creating a task with missing title', async () => {
    const project = await Project.create({ name: 'Project for Missing Title Task', description: '...' });
    const projectId = project.id;
    const newTask = { description: 'Task without a title.' };
    const response = await request(server)
      .post(`/api/projects/${projectId}/tasks`)
      .send(newTask);

    expect(response.status).toBe(400); // Assuming 400 for bad request due to validation
    expect(response.body.error).toHaveProperty('message');
  });

  it('should return 404 if updating a non-existent task', async () => {
    const nonExistentTaskId = taskId + 999;
    const response = await request(server)
      .put(`/api/tasks/${nonExistentTaskId}`)
      .send({ title: 'Non Existent Task' });

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Task not found');
  });

  it('should return 404 if deleting a non-existent task', async () => {
    const nonExistentTaskId = taskId + 999;
    const response = await request(server).delete(`/api/tasks/${nonExistentTaskId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Task not found');
  });
});
