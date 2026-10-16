import { useState, useEffect } from 'react'

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetcher()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
    // Callers supply all request dependencies; retries use the same cleanup path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, revision])

  return { data, loading, error, refetch: () => setRevision((value) => value + 1) }
}
