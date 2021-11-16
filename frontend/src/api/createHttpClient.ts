/* eslint-disable no-restricted-globals */
export class ApiException extends Error {
  constructor(message: string, public statusCode: number, public data: any) {
    super(message);
  }
}

export const createHttpClient = (
  baseUrl: string,
  loginPath: string = '/login',
) => {
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
      let message = 'Network error';
      if (body.error) {
        message = body.error;
      } else if (body.message) {
        if (Array.isArray(body.message)) {
          message = body.message[0];
        } else {
          message = body.message;
        }
      }
      throw new ApiException(message, response.status, body);
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
