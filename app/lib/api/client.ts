import { ApiResponse } from '@/app/types/api';

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('Failed to parse response as JSON');
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return json.data as T;
}
