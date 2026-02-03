import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { checkAuth } from '../middleware/auth.middleware';

import { DscMemberController } from '../controllers/dsc-member.controller';

const router = Router();
const dscMemberController = new DscMemberController();

router.use(checkAuth);

router.get(
  '/documents',
  asyncHandler(dscMemberController.getAssignedDocuments.bind(dscMemberController))
);

router.post(
  '/reviews',
  asyncHandler(dscMemberController.submitReview.bind(dscMemberController))
);

router.post(
  '/documents/:id/forward',
  asyncHandler(dscMemberController.forwardDocumentToAdmin.bind(dscMemberController))
);

export default router;