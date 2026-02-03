// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';
import upload from '../middleware/upload';

const router = Router();

// All routes in this file are protected and only for students
router.use(checkAuth, checkRole(['student']));

router.get('/documents', StudentController.getDocuments);
router.post('/submissions', upload.single('file'), StudentController.createSubmission);
router.get('/submissions/:id', StudentController.getSubmissionById);
router.get('/submissions/:id/view', StudentController.viewSubmissionFile);
router.get('/submissions/:id/feedback', StudentController.getFeedbackForSubmission);

export default router;
