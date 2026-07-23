export interface InstructorUserType {
  id: string;
  name: string;
  email: string;
  role?: string;
  employeeId?: string | null;
  gender?: string | null;
  age?: number | null;
}

export interface FitnessClassType {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId?: string | null;
  instructorUser?: InstructorUserType | null;
  category: string;
  imageUrl: string;
  location: string;
  detailedLocation?: string | null;
  startTime: Date;
  endTime: Date;
  capacity: number;
  availableSeats: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
