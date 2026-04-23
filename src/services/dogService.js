import { getPetById, getPets, updatePet } from './mockStore'

function matchesDogFilters(dog, filters = {}) {
  if (filters.size && dog.size !== filters.size) return false
  if (filters.goodWithKids !== undefined && dog.goodWithKids !== filters.goodWithKids) return false
  if (filters.goodWithDogs !== undefined && dog.goodWithDogs !== filters.goodWithDogs) return false
  if (filters.goodWithCats !== undefined && dog.goodWithCats !== filters.goodWithCats) return false
  return true
}

const dogService = {
  getAll: async (filters = {}) => {
    const dogs = getPets()
      .filter(pet => pet.species === 'DOG')
      .filter(dog => matchesDogFilters(dog, filters))

    return { data: { content: dogs, totalPages: 1 } }
  },

  getFeatured: async () => ({
    data: getPets().filter(pet => pet.species === 'DOG').slice(0, 3),
  }),

  getById: async (id) => {
    const dog = getPetById(id)
    if (!dog || dog.species !== 'DOG') {
      throw new Error('Dog not found')
    }
    return { data: dog }
  },

  search: async (query) => {
    const loweredQuery = String(query || '').toLowerCase()
    const matches = getPets().filter(pet =>
      pet.species === 'DOG' &&
      (pet.name.toLowerCase().includes(loweredQuery) || pet.breed.toLowerCase().includes(loweredQuery))
    )

    return { data: matches }
  },

  getMatches: async () => ({
    data: getPets().filter(pet => pet.species === 'DOG'),
  }),

  create: async () => ({ data: {} }),
  update: async (id, updates) => ({ data: updatePet(id, updates) }),
  delete: async () => ({ data: {} }),
}

export default dogService
