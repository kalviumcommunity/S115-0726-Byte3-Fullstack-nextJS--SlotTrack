export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  age?: number;
  gender?: string;
  createdAt: string;
}
