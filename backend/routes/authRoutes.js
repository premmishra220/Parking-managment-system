import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../services/authService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (request, response, next) => {
  try {
    const result = await registerUser(request.body);
    response.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const result = await loginUser(request.body);
    response.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (request, response, next) => {
  try {
    response.json({ success: true, user: request.user });
  } catch (error) {
    next(error);
  }
});

export default router;
