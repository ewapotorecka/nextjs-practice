export async function jsonFetch<T>(
  url: string,
  init?: RequestInit & { baseUrl?: string; signal?: AbortSignal }
) {
  const base = init?.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  const res = await fetch(base + url, {
    ...init,
    cache: init?.cache ?? 'no-store',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    signal: init?.signal, // TanStack passes AbortSignal automatically
    credentials: 'include', // allow httpOnly cookie sessions
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
