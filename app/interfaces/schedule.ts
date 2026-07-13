import { FitnessClass } from "./class";

export interface Schedule {
  id: string;
  date: string;
  items: FitnessClass[];
}
