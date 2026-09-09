import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, deps = [], options = {}) {
  const { immediate = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      const payload = result?.data?.data ?? result?.data ?? result;
      setData(payload);
      return payload;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    if (immediate) execute();
  }, [execute]); // eslint-disable-line

  return { data, loading, error, refetch: execute };
}
