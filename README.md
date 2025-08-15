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
- **Express-Validator**: Middleware for input validation.

## 🏗️ Project Structure

The project follows a layered architecture to ensure separation of concerns and maintainability:

- `src/config`: Contains database and cache configuration.
- `src/controllers`: Handles incoming HTTP requests and sends responses. It interacts with the services layer.
- `src/services`: Contains the business logic of the application. It interacts with the repositories layer and external APIs.
- `src/repositories`: Handles data access logic, interacting directly with the database models.
- `src/models`: Defines the database schemas using Sequelize.
- `src/middleware`: Contains custom middleware, such as the centralized error handler.
- `src/validators`: Contains input validation rules for the API endpoints.
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

    Copy the environment configuration from the example file:

    ```bash
    cp .env.example .env
    ```

    The `.env` file contains the required `MARIADB_ROOT_PASSWORD` for the MariaDB root user within the Docker environment.

    _Note: For production deployments, use a strong, unique password._

3.  **Start the services:**

    ```bash
    docker-compose up --build -d
    ```

    This command will:
    - Build the Node.js application Docker image.
    - Start the MariaDB database container.
    - Start the Valkey cache container.
    - Expose the API on port `3000`.

4.  **Verify the API is running:**

    Open your browser or use `curl` to access:

    ```
    http://localhost:3000/api/projects
    ```

    You should see an empty array `[]` as a response, indicating the API is up and running.

5.  **Running tests:**

    To run the comprehensive test suite:

    ```bash
    npm test
    ```

    This will execute comprehensive tests covering all API endpoints, validation, error handling, and GitHub integration.

## 📋 API Endpoints

All API endpoints are prefixed with `/api`.

### Projects

| Method   | Endpoint                               | Description                            | Body (Example)                                                          |
| :------- | :------------------------------------- | :------------------------------------- | :---------------------------------------------------------------------- |
| `POST`   | `/projects`                            | Create a new project                   | `{"name": "My New Project", "description": "A description..."}`         |
| `GET`    | `/projects`                            | List all projects                      | N/A                                                                     |
| `GET`    | `/projects/:id`                        | Get a project by ID                    | N/A                                                                     |
| `PUT`    | `/projects/:id`                        | Update a project                       | `{"name": "Updated Project Name", "description": "Updated..."}` |
| `DELETE` | `/projects/:id`                        | Delete a project                       | N/A                                                                     |
| `GET`    | `/projects/:id/github/:username`       | Get GitHub repositories for a user (cached) | N/A                                                                     |

### Tasks

| Method   | Endpoint                      | Description                       | Body (Example)                                                                      |
| :------- | :---------------------------- | :-------------------------------- | :---------------------------------------------------------------------------------- |
| `POST`   | `/projects/:projectId/tasks`  | Create a new task for a project   | `{"title": "New Task", "description": "Description...", "status": "pending"}` |
| `GET`    | `/tasks/:id`                  | Get a task by ID                  | N/A                                                                                 |
| `GET`    | `/projects/:projectId/tasks`  | Get all tasks for a project       | N/A                                                                                 |
| `PUT`    | `/tasks/:id`                  | Update a task                     | `{"title": "Updated Task", "status": "completed"}`                          |
| `DELETE` | `/tasks/:id`                  | Delete a task                     | N/A                                                                                 |

## 💡 Next Steps

Here are some potential next steps for improving this project:

1.  **Add Authentication and Authorization:** Implement a security mechanism (e.g., JWT) to control access to API endpoints, ensuring that only authenticated and authorized users can manage projects and tasks.
2.  **Implement a Structured Logger:** Replace the basic `console.error` logging with a more robust, production-ready logger like Pino or Winston. This will enable structured, leveled logging, which is essential for effective monitoring and debugging in a production environment.
3.  **Expand Test Coverage:** While the current test suite is robust, it could be expanded to include more complex integration scenarios, performance tests, and security-focused tests to identify potential vulnerabilities.
4.  **Implement Caching for More Endpoints:** Consider adding caching to other frequently accessed, read-only endpoints (e.g., `GET /api/projects/:id`) to further improve performance and reduce database load.

## 🛠️ Development Tools

- **Jest**: JavaScript testing framework with comprehensive test suite
- **Supertest**: HTTP assertion library for testing Node.js servers
- **Prettier**: Code formatter ensuring consistent style across the codebase
- **Express-Validator**: Input validation and sanitization middleware
- **Docker Compose**: Multi-container orchestration for development environment

## ⚡ Features

- **Layered Architecture**: Clean separation between controllers, services, and repositories
- **Input Validation**: Comprehensive validation with length limits and character restrictions
- **Caching**: GitHub API responses cached using Valkey for improved performance
- **Error Handling**: Centralized error handling with user-friendly messages
- **Security**: Input sanitization and HTML escaping to prevent XSS attacks
- **Testing**: Extensive test coverage with edge case handling
- **Docker Support**: Complete containerized development environment

## 📊 Validation Rules

### Projects

- **Name**: Required, 1-255 characters, alphanumeric with safe punctuation only
- **Description**: Optional, maximum 2000 characters

### Tasks

- **Title**: Required, 1-255 characters
- **Description**: Optional, maximum 2000 characters
- **Status**: Must be one of: `pending`, `in-progress`, `completed`
