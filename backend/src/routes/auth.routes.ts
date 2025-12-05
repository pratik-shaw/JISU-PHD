// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../models/user.validation';
import { checkAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', checkAuth, AuthController.getMe);

export default router;
