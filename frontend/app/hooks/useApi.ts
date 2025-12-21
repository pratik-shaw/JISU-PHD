"use client";
// frontend/app/hooks/useApi.ts
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useApi = () => {
  const router = useRouter();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = localStorage.getItem('authToken');

      let fullUrl = url;
      // If the URL is relative and not an absolute URL starting with http(s)://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
      }

      const defaultHeaders: HeadersInit = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      if (!(options.body instanceof FormData)) {
        (defaultHeaders as Record<string, string>)['Content-Type'] = 'application/json';
      }

      const finalOptions: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(fullUrl, finalOptions);

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/home'); // Or a more specific login page if needed
        throw new Error('Unauthorized');
      }

      return response;
    },
    [router]
  );

  return apiFetch;
};
