// src/seed.ts
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import pool from './config/database';
import logger from './utils/logger';

const seedAdminUser = async () => {
  try {
    logger.info('Seeding database...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    // Check if admin user already exists
    const existingAdmin = await UserRepository.findByEmail(adminEmail);
    if (existingAdmin) {
      logger.warn(`Admin user with email ${adminEmail} already exists. Skipping.`);
      return;
    }

    // Create admin user
    const passwordHash = await AuthService.hashPassword(adminPassword);
    await UserRepository.create({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword, // DTO expects password, though we use the hash
      role: 'admin',
    }, passwordHash);

    logger.info('✔ Admin user created successfully!');
    logger.info(`  Email: ${adminEmail}`);
    logger.info(`  Password: ${adminPassword}`);

  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await pool.end(); // Close the database connection pool
  }
};

seedAdminUser();
