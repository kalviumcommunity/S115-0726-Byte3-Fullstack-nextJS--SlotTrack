import { classRepository } from '../repositories/class.repository';
import { classValidator } from '../validators/class.validator';
import { FitnessClass } from '../generated/prisma';

export const classService = {
  // Retrieve all fitness classes with optional filters
  async getClasses(filters?: { category?: string; location?: string }): Promise<Omit<FitnessClass, 'createdAt' | 'updatedAt'>[]> {
    return classRepository.findAll(filters);
  },

  // Retrieve a fitness class by ID
  async getClassById(id: string): Promise<FitnessClass> {
    const fitnessClass = await classRepository.findById(id);
    if (!fitnessClass) {
      const error = new Error(`Fitness class with ID ${id} does not exist.`) as Error & { status?: number };
      error.status = 404;
      throw error;
    }
    return fitnessClass;
  },

  // Create a fitness class (Admin only)
  async createClass(data: unknown, userRole: string): Promise<FitnessClass> {
    // 1. Authorization check
    if (userRole !== 'ADMIN') {
      const error = new Error('Forbidden: Only admin users are allowed to perform this action.') as Error & { status?: number };
      error.status = 403;
      throw error;
    }

    // 2. Validate payload
    const validated = classValidator.validateCreate(data);

    // 3. Construct data and create
    const startTime = new Date(validated.startTime);
    const endTime = new Date(validated.endTime);
    const capacity = validated.capacity;

    const classData = {
      title: validated.title,
      description: validated.description,
      instructor: validated.instructor,
      instructorId: validated.instructorId,
      category: validated.category,
      imageUrl: validated.imageUrl,
      location: validated.location,
      detailedLocation: validated.detailedLocation,
      startTime,
      endTime,
      capacity,
      availableSeats: capacity,
      price: validated.price,
    };

    return classRepository.create(classData);
  },

  // Update fitness class details (Admin only)
  async updateClass(id: string, data: unknown, userRole: string): Promise<FitnessClass> {
    // 1. Authorization check
    if (userRole !== 'ADMIN') {
      const error = new Error('Forbidden: Only admin users are allowed to perform this action.') as Error & { status?: number };
      error.status = 403;
      throw error;
    }

    // 2. Verify class existence
    const existingClass = await classRepository.findById(id);
    if (!existingClass) {
      const error = new Error(`Fitness class with ID ${id} does not exist.`) as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    // 3. Validate partial payload
    const validated = classValidator.validateUpdate(data);

    // 4. Construct updated fields
    const updateData: {
      title?: string;
      description?: string;
      instructor?: string;
      category?: string;
      imageUrl?: string;
      location?: string;
      detailedLocation?: string;
      startTime?: Date;
      endTime?: Date;
      capacity?: number;
      availableSeats?: number;
      price?: number;
    } = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.instructor !== undefined) updateData.instructor = validated.instructor;
    if (validated.category !== undefined) updateData.category = validated.category;
    if (validated.imageUrl !== undefined) updateData.imageUrl = validated.imageUrl;
    if (validated.location !== undefined) updateData.location = validated.location;
    if (validated.detailedLocation !== undefined) updateData.detailedLocation = validated.detailedLocation;
    if (validated.price !== undefined) updateData.price = validated.price;

    // Check date bounds
    const startTime = validated.startTime ? new Date(validated.startTime) : existingClass.startTime;
    const endTime = validated.endTime ? new Date(validated.endTime) : existingClass.endTime;

    if (startTime >= endTime) {
      const error = new Error('Start time must be before end time') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    if (validated.startTime !== undefined) updateData.startTime = startTime;
    if (validated.endTime !== undefined) updateData.endTime = endTime;

    // Capacity checking and dynamic seat calculations
    if (validated.capacity !== undefined) {
      const bookedSeats = await classRepository.countBookings(id);
      if (validated.capacity < bookedSeats) {
        const error = new Error(`Capacity cannot be reduced below the number of active bookings (${bookedSeats}).`) as Error & { status?: number };
        error.status = 409;
        throw error;
      }
      updateData.capacity = validated.capacity;
      updateData.availableSeats = validated.capacity - bookedSeats;
    }

    return classRepository.update(id, updateData);
  },

  // Delete a fitness class (Admin only)
  async deleteClass(id: string, userRole: string): Promise<{ id: string; message: string }> {
    // 1. Authorization check
    if (userRole !== 'ADMIN') {
      const error = new Error('Forbidden: Only admin users are allowed to perform this action.') as Error & { status?: number };
      error.status = 403;
      throw error;
    }

    // 2. Verify class existence
    const existingClass = await classRepository.findById(id);
    if (!existingClass) {
      const error = new Error(`Fitness class with ID ${id} does not exist.`) as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    // 3. Prevent deletion if there are active bookings
    const activeBookings = await classRepository.countBookings(id);
    if (activeBookings > 0) {
      const error = new Error('Cannot delete a fitness class that has active bookings.') as Error & { status?: number };
      error.status = 409;
      throw error;
    }

    // 4. Perform class deletion
    const deletedClass = await classRepository.delete(id);
    return {
      id: deletedClass.id,
      message: 'Fitness class and all associated bookings deleted successfully.',
    };
  },
};
