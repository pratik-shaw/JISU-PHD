// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for admins
router.use(checkAuth, checkRole(['admin']));

router.get('/stats', AdminController.getDashboardStats);
router.get('/recent-activity', AdminController.getRecentUserActivity);

export default router;
