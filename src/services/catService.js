import { getPetById, getPets, updatePet } from './mockStore'

function matchesCatFilters(cat, filters = {}) {
  if (filters.indoorOutdoor && cat.indoorOutdoor !== filters.indoorOutdoor) return false
  if (filters.goodWithKids !== undefined && cat.goodWithKids !== filters.goodWithKids) return false
  if (filters.goodWithDogs !== undefined && cat.goodWithDogs !== filters.goodWithDogs) return false
  return true
}

const catService = {
  getAll: async (filters = {}) => {
    const cats = getPets()
      .filter(pet => pet.species === 'CAT')
      .filter(cat => matchesCatFilters(cat, filters))

    return { data: { content: cats, totalPages: 1 } }
  },

  getFeatured: async () => ({
    data: getPets().filter(pet => pet.species === 'CAT').slice(0, 3),
  }),

  getById: async (id) => {
    const cat = getPetById(id)
    if (!cat || cat.species !== 'CAT') {
      throw new Error('Cat not found')
    }
    return { data: cat }
  },

  search: async (query) => {
    const loweredQuery = String(query || '').toLowerCase()
    const matches = getPets().filter(pet =>
      pet.species === 'CAT' &&
      (pet.name.toLowerCase().includes(loweredQuery) || pet.breed.toLowerCase().includes(loweredQuery))
    )

    return { data: matches }
  },

  getMatches: async () => ({
    data: getPets().filter(pet => pet.species === 'CAT'),
  }),

  create: async () => ({ data: {} }),
  update: async (id, updates) => ({ data: updatePet(id, updates) }),
  delete: async () => ({ data: {} }),
}

export default catService
