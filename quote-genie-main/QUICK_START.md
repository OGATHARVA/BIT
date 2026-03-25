# Backend Integration - Installation & Usage Quick Start

## Installation Steps

### 1. Install Dependencies
Run this in the project root:
```bash
npm install
```

This will install:
- **Frontend**: React, Vite, Shadcn UI components
- **Backend**: Express.js, PostgreSQL client, JWT, CORS, and more

### 2. Setup Environment
Create `.env.local` in the root directory (already created, just update):

```env
# Backend Configuration
PORT=3001
FRONTEND_URL=http://localhost:8080

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-key-change-this

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=quote_genie

NODE_ENV=development
```

### 3. Setup PostgreSQL Database

**Option A: Using psql (Windows/Mac/Linux)**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE quote_genie;

# Verify (you should see quote_genie in the list)
\l

# Exit
\q
```

**Option B: Using pgAdmin GUI**
- Open PgAdmin
- Right-click "Databases" → Create → Database
- Name: `quote_genie`

### 4. Run Everything

**Option 1: Run Both Frontend + Backend Together**
```bash
npm run dev:full
```

**Option 2: Run in Separate Terminals**

Terminal 1 (Frontend):
```bash
npm run dev
# Runs on http://localhost:8080
```

Terminal 2 (Backend):
```bash
npm run dev:backend
# Runs on http://localhost:3001
```

## Verify Setup

### Check Backend is Running
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-24T10:00:00.000Z",
  "uptime": 2.345
}
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Using the API in React Components

### Example 1: Login Component
```typescript
import { apiClient } from '@/lib/api';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await apiClient.login(email, password);
      console.log('Logged in:', response.user);
      // Token automatically saved to localStorage
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        type="password"
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### Example 2: Quotation List
```typescript
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

export function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await apiClient.getQuotations();
        setQuotations(response.quotations || []);
      } catch (error) {
        console.error('Failed to fetch quotations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {quotations.map((quote) => (
        <div key={quote.id}>
          <h3>{quote.title}</h3>
          <p>Total: ${quote.total}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Create Quotation
```typescript
import { apiClient } from '@/lib/api';

async function createQuotation() {
  try {
    const response = await apiClient.createQuotation({
      title: 'Website Redesign',
      description: 'Complete website overhaul',
      items: [
        { name: 'Design', price: 1000 },
        { name: 'Development', price: 3000 },
        { name: 'Testing', price: 500 },
      ],
      total: 4500,
    });
    
    console.log('Created:', response.quotation);
  } catch (error) {
    console.error('Creation failed:', error);
  }
}
```

## Folder Structure

```
quote-genie-main/
├── src/
│   ├── BACKEND/              ← Backend server
│   │   ├── server.ts         ← Express server entry
│   │   ├── routes/           ← API endpoints
│   │   │   ├── auth.ts
│   │   │   ├── quotation.ts
│   │   │   ├── proposal.ts
│   │   │   ├── file.ts
│   │   │   └── health.ts
│   │   ├── middleware/       ← Custom middleware
│   │   │   └── auth.ts       ← JWT verification
│   │   ├── config/           ← Configuration
│   │   │   └── database.ts
│   │   ├── .env.example
│   │   └── README.md
│   ├── lib/
│   │   ├── api.ts            ← Frontend API client ⭐ USE THIS
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── components/           ← React components
│   ├── pages/                ← Pages
│   └── main.tsx
├── .env.local                ← Environment variables
├── package.json              ← Dependencies & scripts
├── BACKEND_SETUP.md          ← Setup guide
└── vite.config.ts
```

## Available Scripts

```bash
# Frontend
npm run dev              # Run frontend only (port 8080)

# Backend
npm run dev:backend     # Run backend only (port 3001)
npm run build:backend   # Build backend for production

# Both Together
npm run dev:full        # Run frontend + backend together

# Other
npm run build           # Build frontend for production
npm run lint            # Check code style
npm test                # Run tests
```

## Common Issues

### ❌ "Cannot find module 'express'"
```bash
npm install
```

### ❌ "Port 3001 already in use"
Change PORT in `.env.local` or kill the process:
```bash
# Mac/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### ❌ "PostgreSQL connection refused"
- Ensure PostgreSQL is running (check Services on Windows)
- Verify credentials in `.env.local`
- Check database exists: `psql -U postgres -l`

### ❌ "CORS error when frontend calls backend"
- Ensure backend is running on port 3001
- Check `FRONTEND_URL` in `.env.local` matches frontend URL
- Make sure token is sent in request headers

## Next Steps

Once basic setup is complete:

1. ✅ **Database Schema**: Create tables for users, quotations, proposals
2. ✅ **Password Hashing**: Use `bcrypt` instead of plain text
3. ✅ **File Upload**: Implement file storage (local or cloud)
4. ✅ **Validation**: Add input validation with `zod`
5. ✅ **AI Integration**: Connect to OpenAI or Anthropic APIs
6. ✅ **Real Data**: Connect all routes to PostgreSQL queries
7. ✅ **Testing**: Write unit and integration tests
8. ✅ **Deployment**: Deploy to production (Heroku, Vercel, etc.)

## Support

- Check [BACKEND_SETUP.md](./BACKEND_SETUP.md) for more details
- Check [src/BACKEND/README.md](./src/BACKEND/README.md) for API documentation
- Review example components in `src/components/`

---

**Happy Coding! 🚀**
