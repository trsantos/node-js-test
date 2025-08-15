# Project Overview

This is a **Project and Task Management API** built with Node.js and Express. Its primary purpose is to provide a robust and scalable REST API for managing projects and their associated tasks.

## Key Technologies:

- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework for Node.js.
- **MariaDB**: Relational database management system (used via Docker).
- **Sequelize**: ORM (Object-Relational Mapper) for Node.js, used for database interactions.
- **Valkey**: An open-source, high-performance key-value data store (Redis-compatible) used for caching.
- **Docker & Docker Compose**: For containerization and orchestration of the application and its services.
- **Axios**: Promise-based HTTP client for making requests to external APIs (e.g., GitHub).
- **Express-Validator**: Middleware for input validation.

## Architecture:

The project follows a layered architecture to ensure separation of concerns and maintainability:

- `src/config`: Database and cache configuration.
- `src/controllers`: Handles incoming HTTP requests and sends responses, interacting with the services layer.
- `src/services`: Contains the business logic, interacting with the repositories layer and external APIs.
- `src/repositories`: Handles data access logic, interacting directly with the database models.
- `src/models`: Defines the database schemas using Sequelize.
- `src/routes`: Defines the API endpoints and maps them to controller methods.
- `index.js`: The main application file, responsible for setting up the Express server and connecting to the database.

# Building and Running

To run this API locally, you need to have Docker and Docker Compose installed.

1.  **Environment Variables:**
    Copy the environment configuration from the example file:

    ```bash
    cp .env.example .env
    ```

    The `.env` file contains the required `MARIADB_ROOT_PASSWORD` for the MariaDB root user within the Docker environment.

    _Note: For production deployments, use a strong, unique password._

2.  **Start the services:**

    ```bash
    docker-compose up --build -d
    ```

    This command will:
    - Build the Node.js application Docker image.
    - Start the MariaDB database container.
    - Start the Valkey cache container.
    - Expose the API on port `3000`.

3.  **Verify the API is running:**
    Open your browser or use `curl` to access:
    ```
    http://localhost:3000/api/projects
    ```
    You should see an empty array `[]` as a response, indicating the API is up and running.

# Testing

The project uses `jest` for testing, with `supertest` for HTTP assertions.

To run the tests, use the following command:

```bash
npm test
```

This will execute comprehensive tests covering all API endpoints, validation, error handling, and GitHub integration.

# Development Tools

- **Jest**: JavaScript testing framework with comprehensive test suite
- **Supertest**: HTTP assertion library for testing Node.js servers
- **Prettier**: Code formatter ensuring consistent style across the codebase
- **Express-Validator**: Input validation and sanitization middleware
- **Docker Compose**: Multi-container orchestration for development environment

# Development Conventions

- **Layered Architecture**: The project adheres to a clear separation of concerns with `controllers`, `services`, and `repositories` layers.
- **Input Validation**: All API endpoints that accept input are validated using `express-validator`.
- **Centralized Error Handling**: A centralized error-handling middleware is used to ensure consistent error responses.
- **ORM Usage**: Sequelize is used for all database interactions, abstracting raw SQL queries.
- **Testing**: Jest and Supertest are used for unit and integration testing, with a dedicated setup for global test configurations.
- **Containerization**: Docker and Docker Compose are used for consistent development and deployment environments.
- **Code Formatting**: Code is automatically formatted using Prettier.

## Features

- **Layered Architecture**: Clean separation between controllers, services, and repositories
- **Input Validation**: Comprehensive validation with length limits and character restrictions
- **Caching**: GitHub API responses cached using Valkey for improved performance
- **Error Handling**: Centralized error handling with user-friendly messages
- **Security**: Input sanitization and HTML escaping to prevent XSS attacks
- **Testing**: Extensive test coverage with edge case handling
- **Docker Support**: Complete containerized development environment

## Validation Rules

### Projects

- **Name**: Required, 1-255 characters, alphanumeric with safe punctuation only
- **Description**: Optional, maximum 2000 characters

### Tasks

- **Title**: Required, 1-255 characters
- **Description**: Optional, maximum 2000 characters
- **Status**: Must be one of: `pending`, `in-progress`, `completed`