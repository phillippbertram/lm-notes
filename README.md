# LM Notes

A modern note-taking application built with Next.js, Python FastAPI, and AI capabilities.

## Project Structure

The project is organized into two main components:

- `web/`: Frontend application built with Next.js
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

## Environment Variables

### Frontend (.env in lmnotes directory)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Backend (.env in api directory)

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@db:5432/lmnotes

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

## Getting Started

### Local Development Setup

#### Frontend Setup

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

#### Backend Setup

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

### Docker Deployment

1. Create the required `.env` files:

   - Create `lmnotes/.env` with frontend environment variables
   - Create `api/.env` with backend environment variables

2. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

3. Access the services:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432

4. To stop the services:

   ```bash
   docker-compose down
   ```

5. To view logs:
   ```bash
   docker-compose logs -f
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
- OpenAI API
- Pinecone Vector Database

## Required API Keys and Services

To run the application, you'll need to obtain the following:

1. **OpenAI API Key**

   - Visit [OpenAI Platform](https://platform.openai.com)
   - Create an account and generate an API key
   - Add the key to `api/.env` as `OPENAI_API_KEY`

2. **Pinecone Account and API Key**
   - Visit [Pinecone](https://www.pinecone.io)
   - Create an account and create a new project
   - Generate an API key
   - Create an index for vector storage
   - Add the following to `api/.env`:
     - `PINECONE_API_KEY`
     - `PINECONE_ENVIRONMENT`
     - `PINECONE_INDEX_NAME`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
