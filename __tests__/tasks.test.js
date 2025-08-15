const request = require('supertest');
const app = require('../index');
const http = require('http');
const Project = require('../src/models/project');
const Task = require('../src/models/task');

let server;
let projectId;
let taskId;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

beforeEach(async () => {
  // Ensure database is ready and clear mocks
  await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for database readiness
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
    const response = await request(server).post(`/api/projects/${projectId}/tasks`).send(newTask);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
    expect(Number(response.body.ProjectId)).toEqual(projectId);
  });

  it('should update a task', async () => {
    const task = await Task.create({
      title: 'Task to Update',
      description: '...',
      ProjectId: projectId,
    });
    const taskId = task.id;
    const updatedTitle = 'Updated Task Title';
    const response = await request(server)
      .put(`/api/tasks/${taskId}`)
      .send({ title: updatedTitle });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTitle);
  });

  it('should delete a task', async () => {
    const task = await Task.create({
      title: 'Task to Delete',
      description: '...',
      ProjectId: projectId,
    });
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
    const project = await Project.create({
      name: 'Project for Missing Title Task',
      description: '...',
    });
    const projectId = project.id;
    const newTask = { description: 'Task without a title.' };
    const response = await request(server).post(`/api/projects/${projectId}/tasks`).send(newTask);

    expect(response.status).toBe(400); // Assuming 400 for bad request due to validation
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Task title is required');
  });

  it('should return 400 if updating a task with an empty title', async () => {
    const project = await Project.create({ name: 'Project for Task Update', description: '...' });
    const task = await Task.create({
      title: 'Task to Update',
      description: '...',
      ProjectId: project.id,
    });
    const taskId = task.id;
    const response = await request(server).put(`/api/tasks/${taskId}`).send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Task title cannot be empty');
  });

  it('should return 400 if creating a task with an invalid status', async () => {
    const project = await Project.create({
      name: 'Project for Invalid Status',
      description: '...',
    });
    const projectId = project.id;
    const newTask = { title: 'Task with Invalid Status', status: 'invalid-status' };
    const response = await request(server).post(`/api/projects/${projectId}/tasks`).send(newTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Invalid status value');
  });

  it('should return 400 if updating a task with an invalid status', async () => {
    const project = await Project.create({
      name: 'Project for Invalid Status Update',
      description: '...',
    });
    const task = await Task.create({
      title: 'Task to Update Status',
      description: '...',
      ProjectId: project.id,
    });
    const taskId = task.id;
    const response = await request(server)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'invalid-status' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Invalid status value');
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

  it('should orphan tasks when a project is deleted', async () => {
    // 1. Create a project and a task
    const project = await Project.create({ name: 'Project with Tasks', description: '...' });
    const task = await Task.create({
      title: 'Task to be Orphaned',
      description: '...',
      ProjectId: project.id,
    });

    // 2. Delete the project
    await request(server).delete(`/api/projects/${project.id}`);

    // 3. Verify the task still exists but is orphaned
    const orphanedTask = await Task.findByPk(task.id);
    expect(orphanedTask).not.toBeNull();
    expect(orphanedTask.ProjectId).toBeNull();
  });

  // New endpoint tests
  it('should get a task by ID', async () => {
    const project = await Project.create({ name: 'Project for Task Get', description: '...' });
    const task = await Task.create({
      title: 'Task to Get',
      description: 'Test task description',
      status: 'pending',
      ProjectId: project.id,
    });

    const response = await request(server).get(`/api/tasks/${task.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', task.id);
    expect(response.body.title).toBe('Task to Get');
    expect(response.body.status).toBe('pending');
  });

  it('should return 404 when getting a non-existent task', async () => {
    const response = await request(server).get('/api/tasks/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Task not found');
  });

  it('should get all tasks for a project', async () => {
    const project = await Project.create({ name: 'Project for Task List', description: '...' });

    // Create multiple tasks
    await Task.create({ title: 'Task 1', ProjectId: project.id });
    await Task.create({ title: 'Task 2', ProjectId: project.id });
    await Task.create({ title: 'Task 3', ProjectId: project.id });

    const response = await request(server).get(`/api/projects/${project.id}/tasks`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('ProjectId', project.id);
  });

  it('should return empty array for project with no tasks', async () => {
    const project = await Project.create({ name: 'Empty Project', description: '...' });
    const response = await request(server).get(`/api/projects/${project.id}/tasks`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  // Status enum validation tests
  const validStatuses = ['pending', 'in-progress', 'completed'];
  validStatuses.forEach((status) => {
    it(`should accept valid status: ${status}`, async () => {
      const project = await Project.create({ name: 'Project for Status Test', description: '...' });
      const newTask = { title: `Task with ${status} status`, status };
      const response = await request(server)
        .post(`/api/projects/${project.id}/tasks`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(status);
    });
  });

  it('should default to pending status when not specified', async () => {
    const project = await Project.create({
      name: 'Project for Default Status',
      description: '...',
    });
    const newTask = { title: 'Task without status' };
    const response = await request(server).post(`/api/projects/${project.id}/tasks`).send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pending');
  });

  // URL parameter validation tests
  it('should return 400 for non-numeric task ID in GET', async () => {
    const response = await request(server).get('/api/tasks/invalid-id');
    expect(response.status).toBe(404); // Sequelize converts to null, returns not found
  });

  it('should return 400 for non-numeric task ID in PUT', async () => {
    const response = await request(server)
      .put('/api/tasks/invalid-id')
      .send({ title: 'Updated Title' });
    expect(response.status).toBe(404);
  });

  it('should return 400 for non-numeric task ID in DELETE', async () => {
    const response = await request(server).delete('/api/tasks/invalid-id');
    expect(response.status).toBe(404);
  });

  it('should return 400 for non-numeric project ID in task creation', async () => {
    const newTask = { title: 'Task for invalid project' };
    const response = await request(server).post('/api/projects/invalid-id/tasks').send(newTask);
    expect(response.status).toBe(404);
  });

  it('should return 400 for non-numeric project ID in task listing', async () => {
    const response = await request(server).get('/api/projects/invalid-id/tasks');
    expect(response.status).toBe(200); // Returns empty array for non-existent project
    expect(response.body).toEqual([]);
  });

  // Input sanitization tests
  it('should sanitize HTML in task title', async () => {
    const project = await Project.create({ name: 'Project for Sanitization', description: '...' });
    const maliciousTitle = '<script>alert("xss")</script>Task Title';
    const newTask = { title: maliciousTitle };
    const response = await request(server).post(`/api/projects/${project.id}/tasks`).send(newTask);

    expect(response.status).toBe(201);
    // HTML should be escaped, not executed
    expect(response.body.title).toContain('&lt;script&gt;');
    expect(response.body.title).toContain('Task Title');
  });

  it('should sanitize HTML in task description', async () => {
    const project = await Project.create({
      name: 'Project for Description Sanitization',
      description: '...',
    });
    const maliciousDescription = '<img src="x" onerror="alert(1)">Description';
    const newTask = {
      title: 'Safe Title',
      description: maliciousDescription,
    };
    const response = await request(server).post(`/api/projects/${project.id}/tasks`).send(newTask);

    expect(response.status).toBe(201);
    // HTML should be escaped, not executed - checking the actual escaped output
    expect(response.body.description).toContain('&lt;img');
    expect(response.body.description).toContain('onerror=&quot;alert(1)&quot;');
    expect(response.body.description).toContain('Description');
  });

  // Content-Type validation tests
  it('should handle malformed JSON gracefully', async () => {
    const project = await Project.create({
      name: 'Project for Content-Type Test',
      description: '...',
    });
    const response = await request(server)
      .post(`/api/projects/${project.id}/tasks`)
      .send('{"title": "Test", invalid json}')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });
});
