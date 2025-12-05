// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { createUserSchema } from '../models/user.validation';
import { checkAuth, checkRole } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and only for admins
router.use(checkAuth, checkRole(['admin']));

router.post('/', validate(createUserSchema), UserController.createUser);

// Role management specific - more specific routes first
router.get('/members', UserController.getAllMembers);
router.put('/:id/role', UserController.updateUserRole); // This one is fine here

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById); // This must come AFTER /members
router.put('/:id', validate(createUserSchema.partial()), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
