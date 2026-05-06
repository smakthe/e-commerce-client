// Determine the base URL based on the environment.
// In development (npm run dev), use '/api' to trigger your vite.config.ts proxy.
// In production (Netlify), use the environment variable pointing to your OCI server.
const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Combine the BASE_URL with the endpoint. 
  // Assuming 'endpoint' always starts with a slash (e.g., '/products/explore')
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.errors?.join(', ') || 'API Request Failed');
  }

  // handle 204 no content
  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
}

export const api = {
  request,
  get<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data: any, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data: any, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};