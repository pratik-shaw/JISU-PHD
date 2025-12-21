// src/routes/supervisor.routes.ts
import { Router } from 'express';
import { SupervisorController } from '../controllers/supervisor.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for supervisors
router.use(checkAuth, checkRole(['supervisor']));

router.get('/students', SupervisorController.getAssignedStudents);
router.get('/students/:id', SupervisorController.getStudentProfile);
router.get('/documents', SupervisorController.getReviewDocuments);
router.get('/submissions/:id/view', SupervisorController.viewSubmissionFile);
router.post('/reviews', SupervisorController.submitReview);
router.post('/documents/:id/forward-to-admin', SupervisorController.forwardToAdmin);
router.put('/change-password', SupervisorController.changePassword);

export default router;
