import { useMutation, useQueryClient } from '@tanstack/react-query';

type SignUpInput = {
  email: string;
  password: string;
};

type SignInInput = { email: string; password: string };

function signIn(input: SignInInput) {
  return fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then(async (r) => {
    if (!r.ok) throw new Error('Auto sign-in failed');
    try {
      return await r.json();
    } catch {
      return {};
    }
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SignUpInput) => {
      const res = await fetch('/api/be/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Sign up failed');
      }

      try {
        return await res.json();
      } catch {
        return {};
      }
    },
    onSuccess: async (_data, vars) => {
      await signIn({ email: vars.email, password: vars.password });
      await qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useSignin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SignInInput) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Sign in failed');
      }

      try {
        return await res.json();
      } catch {
        return {};
      }
    },
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
