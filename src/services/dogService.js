// src/services/dogService.js
import api from './api'

// WHY service modules: keeps API logic OUT of components
// Components call dogService.getAll() — they don't know the URL or HTTP method
const dogService = {

  // GET /api/dogs?size=SMALL&goodWithKids=true&page=0
  getAll: (filters = {}, page = 0, pageSize = 12) => {
    const params = { page, pageSize, ...filters }
    // Remove empty/null filters so URL stays clean
    Object.keys(params).forEach(k =>
      (params[k] === '' || params[k] === null || params[k] === undefined)
      && delete params[k])
    return api.get('/dogs', { params })
  },

  getById:   (id)     => api.get(`/dogs/${id}`),
  getFeatured: ()     => api.get('/dogs/featured'),
  search:    (query)  => api.get('/dogs/search', { params: { query } }),

  // POST /api/dogs/match — the quiz endpoint
  getMatches: (quizAnswers) => api.post('/dogs/match', quizAnswers),

  // Admin/Shelter operations
  create: (dogData)        => api.post('/dogs', dogData),
  update: (id, dogData)    => api.put(`/dogs/${id}`, dogData),
  delete: (id)             => api.delete(`/dogs/${id}`),
}

export default dogService