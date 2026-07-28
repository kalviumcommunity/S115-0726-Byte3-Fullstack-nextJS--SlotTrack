import { classService } from '../services/class.service';
import { FitnessClass } from '../generated/prisma';

export const classController = {
  // Retrieve all fitness classes with optional filters
  async getClasses(filters?: { category?: string; location?: string; instructorId?: string; includePast?: boolean }): Promise<Omit<FitnessClass, 'createdAt' | 'updatedAt'>[]> {
    return classService.getClasses(filters);
  },

  // Retrieve class by ID
  async getClassById(id: string): Promise<FitnessClass> {
    return classService.getClassById(id);
  },

  // Handle class creation
  async createClass(data: unknown, userRole: string): Promise<FitnessClass> {
    return classService.createClass(data, userRole);
  },

  // Handle updating class details
  async updateClass(id: string, data: unknown, userRole: string): Promise<FitnessClass> {
    return classService.updateClass(id, data, userRole);
  },

  // Handle class deletion
  async deleteClass(id: string, userRole: string): Promise<{ id: string; message: string }> {
    return classService.deleteClass(id, userRole);
  },
};
