import { classService } from '../services/class.service';

export const classController = {
  // TODO: Handle getting all classes
  async getClasses(): Promise<any[]> {
    return classService.getClasses();
  },

  // TODO: Handle getting class by ID
  async getClassById(id: string): Promise<any> {
    return classService.getClassById(id);
  },

  // TODO: Handle class creation
  async createClass(data: any): Promise<any> {
    return classService.createClass(data);
  },

  // TODO: Handle updating class details
  async updateClass(id: string, data: any): Promise<any> {
    return classService.updateClass(id, data);
  },

  // TODO: Handle class deletion
  async deleteClass(id: string): Promise<any> {
    return classService.deleteClass(id);
  }
};
