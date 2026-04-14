import { useState, useEffect, useCallback } from 'react'
import dogService from '../services/dogService'

export function useDogs(filters = {}, page = 0) {
  const [dogs,       setDogs]       = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const fetchDogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await dogService.getAll(filters, page)
      setDogs(response.data.content)         
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dogs')
    } finally {
      setLoading(false)  
    }
  }, [JSON.stringify(filters), page])  

  useEffect(() => { fetchDogs() }, [fetchDogs])

  return { dogs, totalPages, loading, error, refetch: fetchDogs }
}