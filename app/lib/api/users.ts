import { request } from './client';
import { UserType } from '@/app/types/user';

export async function getProfile(): Promise<UserType> {
  return request<UserType>('/api/auth/profile', {
    method: 'GET',
  });
}

export async function updateProfile(data: { name: string; gender?: string }): Promise<UserType> {
  return request<UserType>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
