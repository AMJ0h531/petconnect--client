import { useState, useEffect, useCallback } from 'react'
import catService from '../services/catService'

export function useCats(filters = {}, page = 0) {
  const [cats,       setCats]       = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const fetchCats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await catService.getAll(filters, page)
      setCats(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cats')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters), page])

  useEffect(() => { fetchCats() }, [fetchCats])

  return { cats, totalPages, loading, error, refetch: fetchCats }
}