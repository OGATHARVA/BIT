import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
