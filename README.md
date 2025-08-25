# Quick Start Guide

## 1. Create .env file
```bash
echo "DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=project_user
DB_PASSWORD=project_password
DB_NAME=project_db" > .env
```

## 2. Start PostgreSQL
```bash
docker-compose up -d
```

## 3. Install & Run
Via pnpm
```bash
pnpm install
pnpm start:dev
pnpm seed
```

Via npm
```bash
npm install
npm run start:dev
npm run seed
```

## 4. Available Endpoints

### Users
- `GET http://localhost:8000/users?limit=10&offset=0&roleIds=1` - get all users (with pagination and role filtering)
- `GET http://localhost:8000/users/:id` - get user by ID
- `POST http://localhost:8000/users` - create new user
- `PATCH http://localhost:8000/users/:id` - update user data (name, email)
- `PATCH http://localhost:8000/users/:id/roles` - update user roles

### Roles
- `GET http://localhost:8000/roles?limit=10&offset=0` - get all roles
- `POST http://localhost:8000/roles` - create new role

### Query Parameters
- `limit` (optional) - number of items to return (default: 10, min: 1)
- `offset` (optional) - number of items to skip (default: 0, min: 0)
- `roleIds` (optional) - array of role IDs to filter users by (e.g. roleIds=1,2,3)

## Stop
```bash
docker-compose down
```
