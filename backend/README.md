# Quote Genie Backend

A Node.js/Express REST API backend for the Quote Genie application, built with TypeScript and PostgreSQL.

## Features

- **Authentication**: JWT-based user authentication with signup, login, and token verification
- **Quotations Management**: Create, read, update, delete quotations with line items
- **Proposals Management**: Create, read, update, delete proposals with templating support
- **Document Management**: List, search, and manage all user documents
- **File Upload**: Support for letterheads and document uploads
- **PDF Generation**: Generate PDF exports of quotations and proposals
- **AI Content Generation**: Integration-ready for AI-powered content generation
- **Database**: PostgreSQL with automatic migrations
- **Error Handling**: Comprehensive error handling and logging

## Quick Start

### Prerequisites

- Node.js 18+ or higher
- PostgreSQL 12+
- npm or similar package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quote_genie_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
PORT=3001
```

4. Start the development server:

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Quotations

- `POST /api/quotations` - Create quotation
- `GET /api/quotations` - List user's quotations
- `GET /api/quotations/:id` - Get specific quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/generate-pdf` - Generate PDF
- `POST /api/quotations/:id/generate-content` - AI-generate content

### Proposals

- `POST /api/proposals` - Create proposal
- `GET /api/proposals` - List user's proposals
- `GET /api/proposals/:id` - Get specific proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal
- `POST /api/proposals/:id/generate-pdf` - Generate PDF
- `POST /api/proposals/:id/generate-sections` - AI-generate sections

### Documents

- `GET /api/documents` - List all user documents
- `GET /api/documents/search` - Search documents
- `POST /api/documents/upload` - Upload file

## Project Structure

```
src/
├── controllers/      # Route handlers
├── middleware/       # Express middleware (auth, error handling)
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── db/              # Database connection and migrations
└── index.ts         # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Database Migrations

Migrations run automatically on server startup. To manually run migrations:

```bash
npm run migrate
```

### Code Quality

Run linting and type checking:

```bash
npm run lint
npm run typecheck
```

## Environment Variables

See `.env.example` for all available configuration options:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `DB_*` - Database connection details
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - JWT expiration time
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `CORS_ORIGIN` - CORS allowed origin
- `LOG_LEVEL` - Logging level

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

MIT

## Next Steps

- Implement quotation CRUD operations
- Implement proposal CRUD operations
- Add AI content generation integration
- Add PDF generation
- Add file upload handling
- Implement document search and filtering
- Add comprehensive tests
