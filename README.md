# LM Notes

A modern note-taking application built with Next.js, Python FastAPI, and AI capabilities.

## Project Structure

The project is organized into two main components:

- `lmnotes/`: Frontend application built with Next.js
- `api/`: Backend API service built with Python FastAPI

## Features

- Modern, responsive UI built with Next.js and Tailwind CSS
- AI-powered note-taking capabilities
- Real-time updates and synchronization
- Database integration with PostgreSQL
- Docker support for easy deployment

## Prerequisites

- Node.js (v18 or higher)
- Python 3.11+
- PostgreSQL
- Docker and Docker Compose (for containerized deployment)

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd lmnotes
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `lmnotes` directory with the necessary environment variables.

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the API server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Development

### Database Management

The project uses Drizzle ORM for database management. Available commands:

```bash
# Generate database migrations
pnpm db:generate

# Push migrations to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

### Docker Deployment

The project includes Docker configuration for both frontend and backend services. To run the entire stack:

```bash
docker-compose up
```

## Tech Stack

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI Components
- Drizzle ORM
- TypeScript

### Backend
- FastAPI
- PostgreSQL
- Python 3.11+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 