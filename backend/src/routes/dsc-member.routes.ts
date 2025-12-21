// src/routes/dsc-member.routes.ts
import { Router } from 'express';
import { DscMemberController } from '../controllers/dsc-member.controller';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for dsc_members
router.use(checkAuth, checkRole(['dsc_member']));

router.get('/documents', DscMemberController.getReviewDocuments);
router.post('/reviews', DscMemberController.submitReview);
router.post('/documents/:id/forward', DscMemberController.forwardDocument);

export default router;
