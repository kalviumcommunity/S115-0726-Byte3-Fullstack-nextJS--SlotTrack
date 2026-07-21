// TODO: Define strict FitnessClass interfaces/types
export interface FitnessClassType {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  imageUrl: string;
  location: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  availableSeats: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
