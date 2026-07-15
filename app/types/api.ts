// TODO: Define strict API request and response interfaces/types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
