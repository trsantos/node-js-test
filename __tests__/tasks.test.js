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
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.query('TRUNCATE TABLE Projects');
  await sequelize.query('TRUNCATE TABLE Tasks');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  const project = await Project.create({ name: 'Test Project', description: 'This is a test project.' });
  projectId = project.id;
  const task = await Task.create({ title: 'Test Task', description: 'This is a test task.', ProjectId: projectId });
  taskId = task.id;
});

afterAll((done) => {
  server.close(done);
});

describe('Tasks API', () => {
  it('should create a new task for a project', async () => {
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
    const updatedTitle = 'Updated Task Title';
    const response = await request(server)
      .put(`/api/tasks/${taskId}`)
      .send({ title: updatedTitle });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTitle);
  });

  it('should delete a task', async () => {
    const response = await request(server).delete(`/api/tasks/${taskId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/tasks/${taskId}`);
    expect(getResponse.status).toBe(404);
  });
});
