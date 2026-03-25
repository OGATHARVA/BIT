import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const authController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: username, email, password',
      });
    }

    try {
      const { user, token } = await authService.signup(username, email, password);
      logger.info(`User ${username} signed up successfully`);

      res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error: any) {
      logger.error('Signup error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Signup failed',
      });
    }
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: identifier, password',
      });
    }

    try {
      const { user, token } = await authService.login(identifier, password);
      logger.info(`User ${identifier} logged in successfully`);

      res.status(200).json({
        success: true,
        data: { user, token },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error.message || 'Login failed',
      });
    }
  }),

  verifyToken: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: token',
      });
    }

    const result = await authService.verifyToken(token);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    logger.info('User logged out');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),
};
