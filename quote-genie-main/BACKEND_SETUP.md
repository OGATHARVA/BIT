# Backend Integration Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.local` and update with your configuration:

```bash
# Database setup
createdb quote_genie

# For PostgreSQL on Windows with PostgreSQL installed:
# Open pgAdmin or use psql:
psql -U postgres
CREATE DATABASE quote_genie;
```

### 3. Start Both Frontend and Backend
```bash
npm run dev:full
```

This will:
- Start the frontend on `http://localhost:8080`
- Start the backend on `http://localhost:3001`

### 4. Test the API
Open your browser and visit:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2026-03-24T...",
  "uptime": 1.234
}
```

## Using the API from the Frontend

The frontend has an `apiClient` utility in `src/lib/api.ts`. Here's how to use it:

### Authentication Example
```typescript
import { apiClient } from '@/lib/api';

// Login
const response = await apiClient.login('user@example.com', 'password123');
console.log(response.user); // User data
// Token is automatically stored in localStorage

// Get current user
const user = await apiClient.getCurrentUser();

// Logout
await apiClient.logout();
```

### Quotations Example
```typescript
import { apiClient } from '@/lib/api';

// Create quotation
const quotation = await apiClient.createQuotation({
  title: 'Website Development',
  description: 'Professional website for e-commerce',
  items: [
    { name: 'Design', price: 500 },
    { name: 'Development', price: 2000 },
  ],
  total: 2500,
});

// Get all quotations
const all = await apiClient.getQuotations();

// Update quotation
await apiClient.updateQuotation(quotation.id, {
  total: 3000,
});

// Delete quotation
await apiClient.deleteQuotation(quotation.id);
```

### Proposals Example
```typescript
// Create proposal
const proposal = await apiClient.createProposal({
  title: 'Mobile App Development',
  projectInfo: { duration: '3 months', budget: 15000 },
  requirements: ['Cross-platform', 'Offline support'],
  services: ['Design', 'Development', 'Testing'],
  content: 'Full proposal text here...',
});

// Get proposals
const proposals = await apiClient.getProposals();

// Update proposal
await apiClient.updateProposal(proposal.id, {
  content: 'Updated proposal...',
});
```

## Running Separate Terminals

If you prefer running frontend and backend in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

## Production Build

### Build Frontend and Backend
```bash
npm run build
npm run build:backend
```

### Run in Production
```bash
npm run start:backend
# Frontend would be served via CDN or static server
```

## Next Steps

1. **Connect to Database**: Update routes in `src/BACKEND/routes/*.ts` to use the database connection from `src/BACKEND/config/database.ts`

2. **Add Authentication**: Implement secure password hashing (bcrypt) and store users in the database

3. **File Uploads**: Implement file storage using local filesystem or cloud providers (AWS S3, Supabase)

4. **AI Integration**: Connect to Anthropic or OpenAI API for quotation/proposal generation

5. **Validation**: Add input validation using `zod` or `joi`

6. **Error Handling**: Implement comprehensive error handling and logging

7. **Testing**: Add backend tests using Jest or Vitest

## Troubleshooting

### Backend won't start
- Check if port 3001 is in use: `npx lsof -i :3001` (macOS/Linux) or `netstat -ano | findstr :3001` (Windows)
- Change PORT in `.env.local`

### Database connection fails
- Ensure PostgreSQL is running
- Check DB credentials in `.env.local`
- Verify database exists: `psql -U postgres -l`

### CORS errors
- Make sure `FRONTEND_URL` in `.env.local` matches your frontend URL
- Check backend CORS middleware in `src/BACKEND/server.ts`

### API token invalid
- Clear localStorage: `localStorage.clear()`
- Login again to get a fresh token

## Default Test Credentials

For testing (before implementing real database):
- Email: `user@example.com`
- Password: `password123`

⚠️ **Important**: Create a `.env.local` file and never commit secrets!
