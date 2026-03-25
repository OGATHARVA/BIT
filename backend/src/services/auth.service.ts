import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/db';
import { User, JwtPayload } from '../types/index';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export const authService = {
  async signup(username: string, email: string, password: string) {
    try {
      // Check if user already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const result = await query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error('Signup error:', error);
      throw error;
    }
  },

  async login(identifier: string, password: string) {
    try {
      // Find user by email or username
      const result = await query(
        'SELECT id, username, email, password FROM users WHERE email = $1 OR username = $1',
        [identifier]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid email/username or password');
      }

      const user = result.rows[0];

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid email/username or password');
      }

      // Create token
      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  },

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // Verify user still exists
      const result = await query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return { valid: true, user: result.rows[0] };
    } catch (error) {
      logger.warn('Token verification failed:', error);
      return { valid: false, user: null };
    }
  },

  async getCurrentUser(userId: string) {
    try {
      const result = await query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  },

  generateToken(user: any): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  },
};
