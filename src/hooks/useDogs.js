// src/hooks/useDogs.js
import { useState, useEffect, useCallback } from 'react'
import dogService from '../services/dogService'

// WHY custom hook: any component that needs dogs calls useDogs()
// The loading/error/retry logic is written ONCE here, not copy-pasted
export function useDogs(filters = {}, page = 0) {
  const [dogs,       setDogs]       = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // WHY useCallback: prevents fetchDogs from being recreated on every render
  // which would cause the useEffect below to run in an infinite loop
  const fetchDogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await dogService.getAll(filters, page)
      setDogs(response.data.content)          // Spring returns Page<DogDTO>
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dogs')
    } finally {
      setLoading(false)  // always runs — clears spinner even on error
    }
  }, [JSON.stringify(filters), page])  // re-fetch when filters or page changes

  useEffect(() => { fetchDogs() }, [fetchDogs])

  // Return everything the component needs + refetch for pull-to-refresh
  return { dogs, totalPages, loading, error, refetch: fetchDogs }
}