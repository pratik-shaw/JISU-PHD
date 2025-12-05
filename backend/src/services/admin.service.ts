// src/services/admin.service.ts
import { UserRepository } from '../repositories/user.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { DscRepository } from '../repositories/dsc.repository';

export const AdminService = {
  async getDashboardStats() {
    const totalUsers = await UserRepository.countAll();
    const pendingApplications = await ApplicationRepository.countByStatus('pending');
    const activeDSCs = await DscRepository.countByStatus('active');
    
    // Mocking recent submissions for now
    const recentSubmissions = 0; 

    return {
      totalUsers,
      pendingApplications,
      activeDSCs,
      recentSubmissions,
    };
  },

  async getRecentUserActivity() {
    // Fetch last 5 recently created users
    return await UserRepository.findRecent(5);
  }
};
