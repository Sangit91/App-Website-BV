# BVDH Docker Development Environment

## Overview

This Docker setup follows **Option 1 Architecture** (Docker Containers on Single VM) for local development with full parity to production deployment.

```
┌──────────────────────────────────────────────────────────────┐
│                    LOCAL DEV (Docker Desktop)                │
│                                                               │
│   ┌──────────────────────────────────────────────────────┐   │
│   │                  Docker Network                       │   │
│   │                                                      │   │
│   │  ┌──────────────┐    ┌──────────────┐               │   │
│   │  │ public-web   │    │  admin-api   │               │   │
│   │  │ Vite :3000   │    │  Express:3001│               │   │
│   │  │ (frontend)   │    │  (backend)   │               │   │
│   │  └──────┬───────┘    └──────┬───────┘               │   │
│   │         │                    │                        │   │
│   │  ┌──────┴────────────────────┴───────┐              │   │
│   │  │     nginx reverse proxy :80        │              │   │
│   │  │   /api/* → admin-api:3001           │              │   │
│   │  │   /*    → public-web:3000           │              │   │
│   │  └──────────────────────────────────────┘              │   │
│   │                                                      │   │
│   │  ┌──────────────┐                                   │   │
│   │  │     db        │                                   │   │
│   │  │ PostgreSQL    │                                   │   │
│   │  │     :5432     │                                   │   │
│   │  └──────────────┘                                   │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Architecture

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Frontend | `bvdh-frontend` | 3000 | Vite dev server with HMR |
| Backend | `bvdh-backend` | 3001 | Express API server |
| Database | `bvdh-db` | 5432 | PostgreSQL 16 |
| Proxy | `bvdh-nginx` | 80/443 | Nginx reverse proxy |

## Quick Start

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- 4GB+ RAM available for Docker
- 10GB+ disk space

### Start Development

```bash
# 1. Ensure Docker Desktop is running

# 2. Copy environment file
cp .env.docker .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be healthy (~30 seconds)

# 5. Access the application
open http://localhost
```

### Access Points

| URL | Description |
|-----|-------------|
| http://localhost | Public website |
| http://localhost/api | Admin API |
| http://localhost:3001/api/health | API health check |
| http://localhost:5432 | PostgreSQL (dev tools) |

## Helper Scripts

```bash
# Make scripts executable
chmod +x scripts/docker-helpers.sh

# Start all services
./scripts/docker-helpers.sh start

# Stop all services
./scripts/docker-helpers.sh stop

# View logs
./scripts/docker-helpers.sh logs

# Restart specific service
./scripts/docker-helpers.sh restart-service admin-api

# Open shell in container
./scripts/docker-helpers.sh shell admin-api

# Connect to database
./scripts/docker-helpers.sh db-connect

# Reset database
./scripts/docker-helpers.sh db-reset

# Run Prisma Studio
./scripts/docker-helpers.sh prisma-studio

# Clean up everything (including data!)
./scripts/docker-helpers.sh clean
```

## Services

### Frontend (public-web)

- **Image**: Vite dev server
- **Port**: 3000 (direct), routed via nginx
- **Hot Reload**: Enabled
- **API Proxy**: Configured in Vite to proxy /api/* to nginx

### Backend (admin-api)

- **Image**: Node.js with tsx
- **Port**: 3001 (direct), internal via nginx
- **Auto Reload**: Enabled (tsx watch)
- **Prisma**: Auto-generated on build

### Database (db)

- **Image**: PostgreSQL 16 Alpine
- **Port**: 5432
- **Data Volume**: `bvdh-postgres-data`
- **Init Script**: `scripts/init-db.sql`

### Nginx (nginx)

- **Image**: Alpine-based nginx
- **Port**: 80, 443
- **Rate Limiting**: Enabled
- **Security Headers**: Enabled

## Environment Variables

Copy `.env.docker` to `.env` for local development:

```bash
cp .env.docker .env
```

Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret (change in prod!) |
| `NODE_ENV` | Environment (development/production) |

## Docker Commands

### Build Images

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f admin-api
```

### Restart Service

```bash
docker-compose restart admin-api
```

### Remove Everything

```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (DATA LOSS!)
docker-compose down -v
```

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker info

# View all logs
docker-compose logs

# Check container status
docker-compose ps
```

### Database connection issues

```bash
# Check database is healthy
docker-compose ps db

# View database logs
docker-compose logs db

# Reset database
./scripts/docker-helpers.sh db-reset
```

### Port conflicts

```bash
# Check what's using port 80
netstat -ano | findstr :80

# Check port 5432
netstat -ano | findstr :5432
```

### Rebuild from scratch

```bash
docker-compose down -v --remove-orphans
docker system prune -f
docker-compose up -d --build
```

## Production Considerations

When deploying to production:

1. **Environment Variables**: Use Docker secrets or environment management
2. **SSL/TLS**: Configure Let's Encrypt or valid certificates
3. **Database**: Use managed PostgreSQL or secure self-hosted
4. **Images**: Build and push to registry, pull in production
5. **Nginx**: Update `nginx.conf` for production (SSL, stricter limits)
6. **Secrets**: Never commit `.env` files, use secrets management

## Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Service orchestration |
| `Dockerfile.frontend` | Frontend image |
| `Dockerfile.backend` | Backend image |
| `nginx/nginx.conf` | Reverse proxy config |
| `scripts/init-db.sql` | Database initialization |
| `.env.docker` | Docker environment template |
| `.dockerignore` | Build exclusions |