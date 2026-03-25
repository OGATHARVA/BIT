# Quote Genie Backend

Express.js backend server for Quote Genie application with PostgreSQL database integration.

## Setup

### 1. Install Dependencies
Backend dependencies are included in the root `package.json`.

### 2. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```bash
cp src/BACKEND/.env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `ANTHROPIC_API_KEY`: For AI features
- `OPENAI_API_KEY`: Alternative AI provider

### 3. Database Setup
Create PostgreSQL database:
```bash
createdb quote_genie
```

Run migrations (coming soon):
```bash
npm run db:migrate
```

## Running the Backend

### Development Mode
```bash
npm run dev:backend
```

### Production Mode
```bash
npm run build:backend && npm start:backend
```

### Run Frontend + Backend Together
```bash
npm run dev:full
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Quotations
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get specific quotation
- `POST /api/quotations` - Create quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation

### Proposals
- `GET /api/proposals` - Get all proposals
- `GET /api/proposals/:id` - Get specific proposal
- `POST /api/proposals` - Create proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal

### Files
- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Download file
- `DELETE /api/files/:id` - Delete file

## Directory Structure
```
src/BACKEND/
├── server.ts           # Main Express server
├── routes/             # API route handlers
│   ├── auth.ts
│   ├── quotation.ts
│   ├── proposal.ts
│   ├── file.ts
│   └── health.ts
├── middleware/         # Custom middleware
│   └── auth.ts
├── config/            # Configuration files
│   └── database.ts
├── .env.example       # Environment template
└── README.md
```

## Next Steps

1. **Database Integration**: Connect routes to PostgreSQL using the `database.ts` config
2. **Authentication**: Implement proper password hashing (bcrypt) and JWT refresh tokens
3. **File Storage**: Implement file upload with cloud storage (AWS S3, Supabase, etc.)
4. **AI Integration**: Add endpoints for quotation/proposal generation using Claude or OpenAI
5. **Validation**: Add request validation using libraries like `zod` or `joi`
6. **Testing**: Add backend tests using Jest or Vitest

## Default Test Credentials

For testing, use:
- Email: `user@example.com`
- Password: `password123`

⚠️ **Important**: Change these before deploying to production!
