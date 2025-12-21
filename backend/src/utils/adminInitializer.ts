import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import logger from './logger';
import { UserRole } from '../models/user.model';

export async function initializeAdminUser(): Promise<void> {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123';
    const adminName = 'Default Admin';
    const adminRole: UserRole = 'admin';

    const existingAdmin = await UserRepository.findAdminUser();

    if (!existingAdmin) {
      logger.info('No admin user found. Creating default admin user.');

      const hashedPassword = await AuthService.hashPassword(adminPassword);

      await UserRepository.create(
        { email: adminEmail, name: adminName, password: adminPassword, role: adminRole },
        hashedPassword
      );
      logger.info('Default admin user created successfully.');
    } else {
      logger.info('Admin user already exists. Skipping default admin creation.');
    }
  } catch (error) {
    logger.error(`Error initializing admin user: ${error}`);
  }
}
