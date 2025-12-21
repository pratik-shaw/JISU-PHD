// src/routes/co-supervisor.routes.ts
import { Router } from 'express';
import { CoSupervisorController } from '../controllers/co-supervisor.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for co-supervisors
router.use(checkAuth, checkRole(['co_supervisor']));

router.get('/students', CoSupervisorController.getAssignedStudents);
router.get('/students/:id', CoSupervisorController.getStudentProfile);
router.get('/documents', CoSupervisorController.getReviewDocuments);
router.get('/submissions/:id/view', CoSupervisorController.viewSubmissionFile);
router.post('/reviews', CoSupervisorController.submitReview);
router.post('/documents/:id/forward', CoSupervisorController.forwardDocument);
router.put('/change-password', CoSupervisorController.changePassword);

export default router;