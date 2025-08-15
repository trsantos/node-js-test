# 🚀 Project and Task Management API

This is a REST API for managing projects and tasks, built with Node.js, Express, MariaDB, and Sequelize. It also includes GitHub integration and Valkey (Redis-compatible) caching.

## 🎯 Objective

The main goal of this project is to provide a robust and scalable API for managing projects and their associated tasks, demonstrating good practices in architecture, security, and performance.

## 📦 Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework for Node.js.
- **MariaDB**: Relational database management system.
- **Sequelize**: ORM (Object-Relational Mapper) for Node.js, used for database interactions.
- **Valkey**: An open-source, high-performance key-value data store (Redis-compatible) used for caching.
- **Docker & Docker Compose**: For containerization and orchestration of the application and its services.
- **Axios**: Promise-based HTTP client for making requests to external APIs (e.g., GitHub).

## 🏗️ Project Structure

The project follows a layered architecture to ensure separation of concerns and maintainability:

- `src/config`: Contains database and cache configuration.
- `src/controllers`: Handles incoming HTTP requests and sends responses. It interacts with the services layer.
- `src/services`: Contains the business logic of the application. It interacts with the repositories layer and external APIs.
- `src/repositories`: Handles data access logic, interacting directly with the database models.
- `src/models`: Defines the database schemas using Sequelize.
- `src/routes`: Defines the API endpoints and maps them to controller methods.
- `index.js`: The main application file, responsible for setting up the Express server and connecting to the database.

## 🚀 Getting Started

To run this API locally, you need to have Docker and Docker Compose installed on your machine.

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd node-js-test
    ```

2.  **Environment Variables:**

    Create a `.env` file in the root directory of the project with the following content:

    ```
    MARIADB_ROOT_PASSWORD=root_password
    ```

    _Note: This password is used for the MariaDB root user within the Docker environment. For production, use a strong, unique password._

3.  **Start the services:**

    ```bash
    docker-compose up --build -d
    ```

    This command will:
    - Build the Node.js application Docker image.
    - Start the MariaDB database container.
    - Start the Valkey cache container.
    - Expose the API on port `3000`.
    - Expose the MariaDB database on port `3306`.
    - Expose the Valkey cache on port `6380`.

4.  **Verify the API is running:**

    Open your browser or use `curl` to access:

    ```
    http://localhost:3000/api/projects
    ```

    You should see an empty array `[]` as a response, indicating the API is up and running.

## 📋 API Endpoints

All API endpoints are prefixed with `/api`.

### Projects

- **Create a new project**
  - `POST /api/projects`
  - **Body:** `{"name": "My New Project", "description": "A description of my new project."}`
  - **Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"name": "My New Project", "description": "A description of my new project."}' http://localhost:3000/api/projects
    ```

- **List all projects**
  - `GET /api/projects`
  - **Example:**
    ```bash
    curl http://localhost:3000/api/projects
    ```

- **Get a project by ID**
  - `GET /api/projects/:id`
  - **Example:**
    ```bash
    curl http://localhost:3000/api/projects/1
    ```

- **Update a project**
  - `PUT /api/projects/:id`
  - **Body:** `{"name": "Updated Project Name"}` (or any other field to update)
  - **Example:**
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Project Name"}' http://localhost:3000/api/projects/1
    ```

- **Delete a project**
  - `DELETE /api/projects/:id`
  - **Example:**
    ```bash
    curl -X DELETE http://localhost:3000/api/projects/1
    ```

- **Get GitHub repositories for a user (cached)**
  - `GET /api/projects/:id/github/:username`
  - **Example:**
    ```bash
    curl http://localhost:3000/api/projects/1/github/octocat
    ```

### Tasks

- **Create a new task for a project**
  - `POST /api/projects/:projectId/tasks`
  - **Body:** `{"title": "New Task", "description": "Description of the new task.", "status": "pending"}`
  - **Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"title": "New Task", "description": "Description of the new task.", "status": "pending"}' http://localhost:3000/api/projects/1/tasks
    ```

- **Update a task**
  - `PUT /api/tasks/:id`
  - **Body:** `{"status": "completed"}` (or any other field to update)
  - **Example:**
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' http://localhost:3000/api/tasks/1
    ```

- **Delete a task**
  - `DELETE /api/tasks/:id`
  - **Example:**
    ```bash
    curl -X DELETE http://localhost:3000/api/tasks/1
    ```

## 💡 Next Steps

Here are some potential next steps for improving this project:

1.  **Implement Input Validation:** Add robust validation for all incoming API requests to ensure data integrity and improve security.
2.  **Add Authentication and Authorization:** Implement a security mechanism (e.g., JWT) to control access to API endpoints.
3.  **Improve Error Handling:** Create a centralized error handling middleware for consistent and informative error responses.
4.  **Add Logging:** Integrate a logging library to record application events and errors.
5.  **Implement Unit and Integration Tests:** Reintroduce automated testing to ensure code quality and prevent regressions.
