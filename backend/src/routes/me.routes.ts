// src/routes/me.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { checkAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(checkAuth);

router.put('/password', UserController.changePassword);

export default router;
