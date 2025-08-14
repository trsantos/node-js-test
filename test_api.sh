#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
echo "Creating a new project..."
BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
echo "Creating a new project..."
BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
echo "Creating a new project..."
BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
echo "Creating a new project..."
BASE_URL="http://localhost:3000/api"

echo "--- Testing Projects API ---"

# 1. Create a new project
echo "Creating a new project..."
PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Script Project", "description": "Project created by script."}' "$BASE_URL/projects")
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Project created: $PROJECT_RESPONSE"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Project created: $PROJECT_RESPONSE"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Project created: $PROJECT_RESPONSE"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Project created: $PROJECT_RESPONSE"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Project created: $PROJECT_RESPONSE"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"

# 2. List all projects
echo "Listing all projects..."
curl -s "$BASE_URL/projects" | jq .

# 3. Get the created project by ID
echo "Getting project by ID $PROJECT_ID..."
curl -s "$BASE_URL/projects/$PROJECT_ID" | jq .

# 4. Update the created project
echo "Updating project $PROJECT_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Script Project"}' "$BASE_URL/projects/$PROJECT_ID" | jq .

# 5. Delete the created project
echo "Deleting project $PROJECT_ID..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID"
echo "Project $PROJECT_ID deleted."

# 6. Create a new project for tasks
echo "Creating a new project for tasks..."
TASK_PROJECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Task Project", "description": "Project for tasks."}' "$BASE_URL/projects")
TASK_PROJECT_ID=$(echo $TASK_PROJECT_RESPONSE | jq -r '.id')
echo "Task project created: $TASK_PROJECT_RESPONSE"

# 7. Create a new task for the project
echo "Creating a new task for project $TASK_PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title": "Script Task", "description": "Task created by script."}' "$BASE_URL/projects/$TASK_PROJECT_ID/tasks")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Task created: $TASK_RESPONSE"

# 8. Update the created task
echo "Updating task $TASK_ID..."
curl -s -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "$BASE_URL/tasks/$TASK_ID" | jq .

# 9. Delete the created task
echo "Deleting task $TASK_ID..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID"
echo "Task $TASK_ID deleted."

# 10. Test GitHub integration
echo "Testing GitHub integration for project $TASK_PROJECT_ID..."
curl -s "$BASE_URL/projects/$TASK_PROJECT_ID/github/octocat" | jq .

echo "--- All tests completed ---"
