// src/services/dsc.service.ts
import { DscRepository } from '../repositories/dsc.repository';
import { UserRepository } from '../repositories/user.repository';
import { DscCreateDTO, DSC, DscMemberDTO } from '../models/dsc.model';
import { ApiError } from '../middleware/errorHandler';

export const DscService = {
  async createDsc(dscDto: DscCreateDTO): Promise<DSC> {
    const dscId = await DscRepository.create(dscDto);
    const newDsc = await DscRepository.findById(dscId);
    if (!newDsc) {
      throw new ApiError(500, 'Failed to create DSC');
    }
    return newDsc;
  },

  async getAllDscs(): Promise<DSC[]> {
    return await DscRepository.findAll();
  },

  async getDscById(id: number): Promise<DSC> {
    const dsc = await DscRepository.findById(id);
    if (!dsc) {
      throw new ApiError(404, 'DSC not found');
    }
    return dsc;
  },

  async updateDsc(id: number, dscDto: Partial<DscCreateDTO>): Promise<DSC> {
    const dsc = await DscRepository.findById(id);
    if (!dsc) {
      throw new ApiError(404, 'DSC not found');
    }
    await DscRepository.update(id, dscDto);
    const updatedDsc = await DscRepository.findById(id);
    if (!updatedDsc) {
        throw new ApiError(500, 'Failed to fetch updated DSC');
    }
    return updatedDsc;
  },

  async deleteDsc(id: number): Promise<void> {
    const dsc = await DscRepository.findById(id);
    if (!dsc) {
      throw new ApiError(404, 'DSC not found');
    }
    await DscRepository.remove(id);
  },

    async removeAllSupervisors(dscId: number) {
        return await DscRepository.removeAllSupervisors(dscId);
    },

    async removeAllMembers(dscId: number) {
        return await DscRepository.removeAllMembers(dscId);
    },
    
    async addMemberToDsc(member: { userId: number, dscId: number, role: 'supervisor' | 'co_supervisor' | 'member' }) {
    const user = await UserRepository.findById(memberDto.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    if (user.role === 'student' || user.role === 'admin') {
        throw new ApiError(400, 'Only faculty members can be added to a DSC');
    }

    const dsc = await DscRepository.findById(memberDto.dscId);
    if (!dsc) {
      throw new ApiError(404, 'DSC not found');
    }
    
    await DscRepository.addMember(memberDto);
  },

  async removeMemberFromDsc(userId: number, dscId: number): Promise<void> {
    await DscRepository.removeMember(userId, dscId);
  },

  async getDscMembers(dscId: number): Promise<any[]> {
    return await DscRepository.findMembersByDscId(dscId);
  },

  async getDscStudents(dscId: number): Promise<any[]> {
    return await DscRepository.findStudentsByDscId(dscId);
  }
};