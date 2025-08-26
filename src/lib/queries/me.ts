import { queryOptions, type QueryFunctionContext } from '@tanstack/react-query';

export type Me = { id: string; email: string; roles?: string[] };

export const meQuery = queryOptions({
  queryKey: ['me'],
  queryFn: async ({ signal }: QueryFunctionContext) => {
    const r = await fetch('/api/be/auth/me', { signal, cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<Me>;
  },

  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  retry: 0,
  refetchOnWindowFocus: false,
});
