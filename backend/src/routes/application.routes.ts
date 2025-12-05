// src/routes/application.routes.ts
import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { validate } from '../middleware/validate';
import { createApplicationSchema, updateApplicationStatusSchema } from '../models/application.validation';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

router.use(checkAuth);

// Student routes
router.post('/', checkRole(['student']), validate(createApplicationSchema), ApplicationController.createApplication);
router.get('/my-applications', checkRole(['student']), ApplicationController.getMyApplications);

// Admin routes
router.get('/', checkRole(['admin']), ApplicationController.getAllApplications);
router.get('/:id', checkRole(['admin']), ApplicationController.getApplicationById);
router.put('/:id/status', checkRole(['admin']), validate(updateApplicationStatusSchema), ApplicationController.updateApplicationStatus);


export default router;
