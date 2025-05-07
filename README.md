# Graduation Project

## Introduction

This project is a web application developed as part of the 8th semester graduation project. It consists of a frontend built with React + TypeScript + Vite and a backend component. The application aims to [brief description of what the application does - e.g., "provide a platform for managing student projects" or "create an interactive learning environment"].

## Directory Structure

```
graduationProject/
├── frontend/              # React + TypeScript + Vite frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── styles/        # CSS/SCSS files
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # API service connections
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Application entry point
│   ├── index.html         # HTML template
│   ├── vite.config.ts     # Vite configuration
│   ├── tsconfig.json      # TypeScript configuration
│   └── package.json       # Frontend dependencies
│
├── backend/               # Backend application
    ├── src/               # Source code
    ├── config/            # Configuration files
    ├── controllers/       # Request handlers
    ├── models/            # Data models
    ├── routes/            # API route definitions
    ├── services/          # Business logic
    ├── utils/             # Utility functions
    └── package.json       # Backend dependencies
```

## Setup and Running the Application

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PHP (v8.0 or later)
- Composer
- [Any other specific dependencies]

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or with yarn:

   ```
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

   or with yarn:

   ```
   yarn dev
   ```

4. The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install PHP dependencies using Composer:

   ```
   composer install
   ```

3. Set up environment file:

   ```
   cp .env.example .env
   php artisan key:generate
   ```

4. Configure your database in the `.env` file, then run migrations:

   ```
   php artisan migrate
   ```

5. Start the Laravel development server:

   ```
   php artisan serve
   ```

6. The API will be available at `http://localhost:8000`

## Building for Production

### Frontend

```
cd frontend
npm run build
```

The build artifacts will be stored in the `frontend/dist/` directory.

### Backend

```
cd backend
php artisan config:cache
php artisan route:cache
php artisan serve --env=production
```

## Coding Conventions

### General

- Use consistent indentation (2 spaces)
- Follow meaningful naming conventions (camelCase for variables and functions, PascalCase for components and classes)
- Write clear, descriptive variable and function names
- Include comments for complex logic
- Keep functions focused and small

### Frontend

- Components should be organized in separate files
- Use functional components with hooks instead of class components
- Prefer TypeScript interfaces for prop types
- Use CSS modules or styled-components for styling
- Keep components reusable and follow the single-responsibility principle

### Backend

- Follow RESTful API design principles
- Implement proper error handling
- Use async/await for asynchronous operations
- Implement middleware for common functionalities
- Keep business logic in service layers

## Testing

### Frontend

```
cd frontend
npm run test
```

### Backend

```
cd backend
php artisan test
```

## Contributing

1. Follow the coding conventions outlined above
2. Write tests for new features
3. Update documentation when necessary

## License

[Specify license information if applicable]
