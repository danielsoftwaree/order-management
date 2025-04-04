# Order Management System

![Order Management Preview](images/image.png)

## About the Project

Order Management System is a comprehensive solution for order management, consisting of:

- **API server** — backend part that processes business logic and database interactions
- **Web interface** — user-friendly interface for working with the system
- **PostgreSQL database** — for storing all system data

## Technology Stack

- **Backend**: Node.js
- **Frontend**: Vite-based web application
- **Database**: PostgreSQL 17
- **Containerization**: Docker and Docker Compose

## Project Structure

```
.
├── apps
│   ├── api         # Backend API server
│   └── web         # Frontend web application
├── docker-compose.yml
└── README.md
```

## Launch Instructions

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Launch Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd order-management
   ```

2. **Launch the project using Docker Compose:**

   ```bash
   docker-compose up -d
   ```

   During the first launch, Docker will download the necessary images and build containers, which may take some time.

3. **Verification:**
   - API server will be available at: http://localhost:5000
   - Web interface will be available at: http://localhost:8080
   - PostgreSQL database will be available on port 5434

### Stopping the Project

```bash
docker-compose down
```

For complete data cleanup (including the database):

```bash
docker-compose down -v
```

## Environment Variables

The project uses the following environment variables:

- `DATABASE_URL` — Database connection URL
- `JWT_SECRET` — Secret key for JWT tokens
- `VITE_BASE_URL` — Base URL for API requests from the frontend

## Development

The project is configured for convenient development — application files are mounted in containers, so code changes are immediately reflected in running services.
