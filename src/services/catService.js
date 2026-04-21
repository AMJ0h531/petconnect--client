// src/services/catService.js
import api from './api'

const catService = {
  getAll: (filters = {}, page = 0, pageSize = 12) => {
    const params = { page, pageSize, ...filters }
    Object.keys(params).forEach(k =>
      (params[k] === '' || params[k] === null || params[k] === undefined)
      && delete params[k])
    return api.get('/cats', { params })
  },

  getById:    (id)          => api.get(`/cats/${id}`),
  getFeatured: ()           => api.get('/cats/featured'),
  search:     (query)       => api.get('/cats/search', { params: { query } }),
  getMatches: (quizAnswers) => api.post('/cats/match', quizAnswers),

  create: (catData)         => api.post('/cats', catData),
  update: (id, catData)     => api.put(`/cats/${id}`, catData),
  delete: (id)              => api.delete(`/cats/${id}`),

}

export default catService