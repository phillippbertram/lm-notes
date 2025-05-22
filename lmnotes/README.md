# LM Notes

A modern note-taking application that combines the power of AI with your personal knowledge base. Built with Next.js, TypeScript, and OpenAI.

## Features

- 📝 Create and manage notebooks
- 📄 Add sources (PDF, TXT) to your notebooks
- 🤖 Chat with an AI assistant about your sources
- 🔍 Semantic search through your sources
- 🎨 Modern, responsive UI
- 🔒 Secure and private

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4
- **Authentication**: NextAuth.js
- **Vector Search**: Pinecone (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lmnotes"

# OpenAI
OPENAI_API_KEY="your-api-key"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Pinecone (coming soon)
PINECONE_API_KEY="your-api-key"
PINECONE_ENVIRONMENT="your-environment"
PINECONE_INDEX="your-index"
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/lmnotes.git
   cd lmnotes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── notebook/       # Notebook pages
│   └── (auth)/        # Authentication pages
├── components/         # React components
├── lib/               # Utility functions and configurations
│   ├── actions/       # Server actions
│   ├── db/           # Database schema and types
│   └── validations/  # Zod validation schemas
└── styles/           # Global styles
```

## Database Schema

### Notebooks

- `id`: UUID (primary key)
- `title`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `userId`: String (foreign key to users)

### Sources

- `id`: UUID (primary key)
- `notebookId`: UUID (foreign key to notebooks)
- `title`: String
- `type`: String (pdf, txt)
- `content`: Text
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database types
- `npm run db:push` - Push schema changes to database

### Adding New Features

1. Create necessary database migrations
2. Add server actions in `src/lib/actions`
3. Create UI components in `src/components`
4. Add validation schemas in `src/lib/validations`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [OpenAI](https://openai.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
