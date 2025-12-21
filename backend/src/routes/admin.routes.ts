// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for admins
router.use(checkAuth, checkRole(['admin']));

router.get('/stats', AdminController.getDashboardStats);
router.get('/recent-activity', AdminController.getRecentUserActivity);
router.get('/submissions/:id', AdminController.getSubmissionById);
router.get('/submissions/:id/view', AdminController.viewAnySubmissionFile);
router.post('/submissions/:id/review', AdminController.reviewSubmission);
router.get('/dscs', AdminController.getDscs);

export default router;
