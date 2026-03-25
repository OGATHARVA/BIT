import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database
const users: any = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // In production, this should be hashed
    name: 'John Doe',
  },
};

// SIGNUP
router.post('/signup', (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (users[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // TODO: Hash password and save to database
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };

    users[email] = newUser;

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// LOGIN
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = users[email];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET current user
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// LOGOUT
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  // Client should remove token from localStorage
  res.json({ message: 'Logged out successfully' });
});

export default router;
