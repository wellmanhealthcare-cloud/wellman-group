'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { setToken, removeToken, getToken } from '@/lib/auth';
import type { AdminUser } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.data.access_token);
    const me = await authApi.me();
    setUser(me.data);
    return me.data;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    window.location.href = '/admin/login';
  }, []);

  const refresh = useCallback(async () => {
    const res = await authApi.me();
    setUser(res.data);
    return res.data;
  }, []);

  return { user, loading, login, logout, refresh };
}
