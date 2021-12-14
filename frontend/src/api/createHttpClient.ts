/* eslint-disable no-restricted-globals */
export class ApiException<T = unknown> extends Error {
  constructor(
    public statusCode: number,
    public data: T extends object ? { constraints?: T } : unknown,
  ) {
    super('Api Exception');
  }
}

export const createHttpClient = (baseUrl: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const fetchJson = async (
    input: RequestInfo,
    options: Omit<RequestInit, 'body'> & { body?: any },
  ) => {
    const _options = {
      headers,
      ...options,
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    };
    const response = await fetch(input, _options);
    if (!response.ok) {
      const body = await response.json();
      throw new ApiException(response.status, body);
    }
    return response.json();
  };
  return {
    get: <T>(path: string) =>
      fetchJson(baseUrl + path, { method: 'GET' }) as Promise<T>,
    post: <T>(path: string, body: any) =>
      fetchJson(baseUrl + path, { method: 'POST', body }) as Promise<T>,
    put: <T>(path: string, body: any) =>
      fetchJson(baseUrl + path, { method: 'PUT', body }) as Promise<T>,
    patch: <T>(path: string, body: any) =>
      fetchJson(baseUrl + path, { method: 'PATCH', body }) as Promise<T>,
    delete: <T>(path: string) =>
      fetchJson(baseUrl + path, { method: 'DELETE' }) as Promise<T>,
    setBearerAuth: (token: string) => {
      headers.Authorization = `Bearer ${token}`;
    },
    removeAuth: () => {
      delete headers.Authorization;
    },
  };
};
