import { ApiResponse } from '@/app/types/api';

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const start = typeof window !== 'undefined' ? performance.now() : 0;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const duration = typeof window !== 'undefined' ? performance.now() - start : 0;
  if (typeof window !== 'undefined') {
    console.log(`[PERF_CLIENT_API] ${options?.method || 'GET'} ${url} - ${duration.toFixed(2)}ms (status ${res.status})`);
  }

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
