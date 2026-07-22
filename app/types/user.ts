import { Role } from '../generated/prisma';

// TODO: Define strict User interfaces/types
export interface UserType {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeId?: string | null;
  gender?: string | null;
  age?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
