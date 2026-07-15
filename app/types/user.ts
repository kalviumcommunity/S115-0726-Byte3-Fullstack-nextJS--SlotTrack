import { Role } from '../generated/prisma';

// TODO: Define strict User interfaces/types
export interface UserType {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
