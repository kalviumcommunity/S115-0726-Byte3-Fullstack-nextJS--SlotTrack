import { request } from './client';
import { FitnessClassType } from '@/app/types/fitness-class';

export async function getClasses(filters?: { category?: string; location?: string }): Promise<FitnessClassType[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'All') {
    params.append('category', filters.category);
  }
  if (filters?.location && filters.location !== 'All') {
    params.append('location', filters.location);
  }
  const queryString = params.toString();
  const url = `/api/classes${queryString ? `?${queryString}` : ''}`;
  return request<FitnessClassType[]>(url, {
    method: 'GET',
  });
}

export async function getClassById(id: string): Promise<FitnessClassType> {
  return request<FitnessClassType>(`/api/classes/${id}`, {
    method: 'GET',
  });
}

export async function createClass(data: unknown): Promise<FitnessClassType> {
  return request<FitnessClassType>('/api/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClass(id: string, data: unknown): Promise<FitnessClassType> {
  return request<FitnessClassType>(`/api/classes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteClass(id: string): Promise<{ id: string; message: string }> {
  return request<{ id: string; message: string }>(`/api/classes/${id}`, {
    method: 'DELETE',
  });
}
