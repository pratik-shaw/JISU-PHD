// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import dscRoutes from './dsc.routes';

import applicationRoutes from './application.routes';

import adminRoutes from './admin.routes';
import dscMemberRoutes from './dsc-member.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dscs', dscRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/dsc-member', dscMemberRoutes);

export default router;
