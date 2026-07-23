#!/bin/bash
# Docker Helper Scripts for BVDH Development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print with color
print_status() {
    echo -e "${GREEN}[BVDH]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[BVDH]${NC} $1"
}

print_error() {
    echo -e "${RED}[BVDH]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
}

# Start all services
start() {
    check_docker
    print_status "Starting BVDH services..."
    docker-compose up -d
    print_status "Services started!"
    print_status "Access the application at http://localhost"
    print_status "  - Public site: http://localhost"
    print_status "  - Admin API: http://localhost/api"
    print_status "  - API Direct: http://localhost:3001/api"
    print_status "  - Database: localhost:5432"
}

# Stop all services
stop() {
    check_docker
    print_status "Stopping BVDH services..."
    docker-compose down
    print_status "Services stopped!"
}

# Rebuild services
rebuild() {
    check_docker
    print_status "Rebuilding BVDH services..."
    docker-compose up -d --build
    print_status "Services rebuilt and started!"
}

# View logs
logs() {
    docker-compose logs -f "$@"
}

# Restart a specific service
restart-service() {
    check_docker
    if [ -z "$1" ]; then
        print_error "Usage: ./docker-helpers.sh restart-service <service-name>"
        print_error "  Services: public-web, admin-api, db, nginx"
        exit 1
    fi
    print_status "Restarting $1..."
    docker-compose restart "$1"
}

# Clean up everything (including volumes - data will be lost!)
clean() {
    check_docker
    print_warning "This will delete ALL data including database!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        print_status "Cleaning up..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_status "Clean up complete!"
    else
        print_status "Cancelled."
    fi
}

# Show status
status() {
    check_docker
    docker-compose ps
}

# Open shell in a container
shell() {
    check_docker
    if [ -z "$1" ]; then
        print_error "Usage: ./docker-helpers.sh shell <service-name>"
        print_error "  Services: public-web, admin-api, db"
        exit 1
    fi

    case "$1" in
        public-web)
            docker exec -it bvdh-frontend sh
            ;;
        admin-api)
            docker exec -it bvdh-backend sh
            ;;
        db)
            docker exec -it bvdh-db psql -U postgres -d bvdh_db
            ;;
        nginx)
            docker exec -it bvdh-nginx sh
            ;;
        *)
            print_error "Unknown service: $1"
            exit 1
            ;;
    esac
}

# Database operations
db-connect() {
    docker exec -it bvdh-db psql -U postgres -d bvdh_db
}

db-reset() {
    print_warning "This will reset the database!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        print_status "Resetting database..."
        docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS bvdh_db;"
        docker-compose exec -T db psql -U postgres -c "CREATE DATABASE bvdh_db;"
        print_status "Database reset complete!"
    fi
}

# Prisma operations in container
prisma-generate() {
    check_docker
    docker-compose exec admin-api npx prisma generate
}

prisma-migrate() {
    check_docker
    docker-compose exec admin-api npx prisma migrate dev
}

prisma-studio() {
    check_docker
    docker-compose exec admin-api npx prisma studio
}

# Show help
help() {
    echo "BVDH Docker Helper Scripts"
    echo ""
    echo "Usage: ./docker-helpers.sh <command>"
    echo ""
    echo "Commands:"
    echo "  start           Start all services"
    echo "  stop            Stop all services"
    echo "  rebuild         Rebuild and start all services"
    echo "  logs [service]  View logs (all or specific service)"
    echo "  status          Show service status"
    echo "  clean           Remove all containers, volumes, and prune"
    echo ""
    echo "Service Commands:"
    echo "  restart-service <name>   Restart a specific service"
    echo "  shell <service>         Open shell in a container"
    echo ""
    echo "Database Commands:"
    echo "  db-connect              Connect to PostgreSQL"
    echo "  db-reset                Reset the database"
    echo "  prisma-generate         Run prisma generate"
    echo "  prisma-migrate          Run prisma migrate"
    echo "  prisma-studio           Open Prisma Studio"
    echo ""
}

# Main command router
case "${1:-}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    rebuild)
        rebuild
        ;;
    logs)
        shift
        logs "$@"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    restart-service)
        restart-service "$2"
        ;;
    shell)
        shell "$2"
        ;;
    db-connect)
        db-connect
        ;;
    db-reset)
        db-reset
        ;;
    prisma-generate)
        prisma-generate
        ;;
    prisma-migrate)
        prisma-migrate
        ;;
    prisma-studio)
        prisma-studio
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac