import { request } from './client';
import { UserType } from '@/app/types/user';

export async function login(data: unknown): Promise<{ user: UserType }> {
  return request<{ user: UserType }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: unknown): Promise<UserType> {
  return request<UserType>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<UserType> {
  return request<UserType>('/api/auth/profile', {
    method: 'GET',
  });
}

export async function updateProfile(data: { name: string }): Promise<UserType> {
  return request<UserType>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
