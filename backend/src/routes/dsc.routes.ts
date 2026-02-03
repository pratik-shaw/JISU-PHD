// src/routes/dsc.routes.ts
import { Router } from 'express';
import { DscController } from '../controllers/dsc.controller';
import { validate } from '../middleware/validate';
import { createDscSchema, addMemberToDscSchema } from '../models/dsc.validation';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for admins
router.use(checkAuth, checkRole(['admin']));

router.post('/', validate(createDscSchema), DscController.createDsc);
router.get('/', DscController.getAllDscs);
router.get('/:id', DscController.getDscById);
router.get('/:id/members', DscController.getDscMembers);
router.get('/:id/students', DscController.getDscStudents);
router.put('/:id', validate(createDscSchema.partial()), DscController.updateDsc);
router.delete('/:id', DscController.deleteDsc);
router.delete('/:id/supervisors', DscController.removeAllSupervisors);
router.delete('/:id/members', DscController.removeAllMembers);

// Member management
router.post('/members', validate(addMemberToDscSchema), DscController.addMemberToDsc);
router.put('/:id/students', DscController.addStudentsToDsc);
router.delete('/:dscId/members/:userId', DscController.removeMemberFromDsc);

export default router;
