export interface FitnessClass {
  id: string;
  title: string;
  instructor: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  capacity: number;
  availableSeats: number;
  category: string;
}
