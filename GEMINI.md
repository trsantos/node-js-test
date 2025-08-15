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
    Create a `.env` file in the root directory of the project with the following content:

    ```
    MARIADB_ROOT_PASSWORD=root_password
    ```

    _Note: This password is used for the MariaDB root user within the Docker environment. For production, use a strong, unique password._

2.  **Start the services:**

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

This command utilizes `jest` and includes global setup and teardown scripts located in `jest-setup/global-setup.js` and `jest-setup/global-teardown.js` respectively.

# Development Conventions

- **Layered Architecture**: The project adheres to a clear separation of concerns with `controllers`, `services`, and `repositories` layers.
- **ORM Usage**: Sequelize is used for all database interactions, abstracting raw SQL queries.
- **Testing**: Jest and Supertest are used for unit and integration testing, with a dedicated setup for global test configurations.
- **Containerization**: Docker and Docker Compose are used for consistent development and deployment environments.
