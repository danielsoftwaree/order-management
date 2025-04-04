# Order Management API

Backend REST API for the order management system, built with NestJS and Prisma.

## Technologies

- **Framework**: NestJS
- **Programming Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Input Validation**: class-validator
- **Containerization**: Docker

## Project Structure

```
api/
│
├── src/                      # Application source code
│   ├── auth/                 # Authentication module
│   │   ├── controllers/      # Auth endpoints
│   │   ├── services/         # Auth business logic
│   │   ├── strategies/       # JWT strategies
│   │   ├── guards/           # Auth guards
│   │   └── middlewares/      # Auth middlewares
│   │
│   ├── user/                 # User module
│   │   ├── controllers/      # User endpoints
│   │   ├── services/         # User business logic
│   │   └── dto/              # Data Transfer Objects
│   │
│   ├── product/              # Product module
│   │   ├── controllers/      # Product endpoints
│   │   ├── services/         # Product business logic
│   │   └── dto/              # Data Transfer Objects
│   │
│   ├── order/                # Order module
│   │   ├── controllers/      # Order endpoints
│   │   ├── services/         # Order business logic
│   │   └── dto/              # Data Transfer Objects
│   │
│   ├── prisma/               # Database connection
│   │   └── schema.prisma     # Database schema
│   │
│   ├── common/               # Shared resources
│   │   ├── filters/          # Exception filters
│   │   ├── interceptors/     # Response interceptors
│   │   └── guards/           # API rate limiting
│   │
│   ├── app.module.ts         # Root module
│   └── main.ts               # Entry point
│
├── prisma/                   # Prisma configuration
│   ├── migrations/           # Database migrations
│   └── schema.prisma         # Database schema
│
├── test/                     # End-to-end tests
├── Dockerfile                # Docker build configuration
└── package.json              # Project dependencies and scripts
```

## Local Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or pnpm

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/order_management"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

### Installing Dependencies

```bash
pnpm install
```

### Database Setup

```bash
# Create database migrations
pnpm migrate

# Apply migrations to database
pnpm migrate:prod
```

### Development Mode

```bash
pnpm start:dev
```

The API will be available at: http://localhost:3000

### Production Build

```bash
pnpm build
pnpm start:prod
```

## Docker

The project can be run in a Docker container:

```bash
# Build the image
docker build -t order-management-api .

# Run the container
docker run -p 3000:3000 --env-file .env order-management-api
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and get token

### Users

- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user details

### Products

- `GET /products` - Get list of products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PATCH /products/:id` - Update product details
- `DELETE /products/:id` - Delete a product

### Orders

- `GET /orders` - Get list of orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create a new order
- `PATCH /orders/:id` - Update order status

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- API rate limiting
- Input validation and sanitization
- CORS protection

## Database Schema

The application uses the following data models:

- **User** - Stores user information, account balance, and authentication details
- **Product** - Contains product details such as name, price, and stock level
- **Order** - Represents a purchase of products by users

## Development Guidelines

- Use DTOs for data validation and transformation
- Follow NestJS module organization
- Write unit tests for services
- Implement proper error handling
- Use transactions for database operations that affect multiple tables
