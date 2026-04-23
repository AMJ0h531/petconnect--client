import { DOGS, CATS } from '../data/mockData'

const PETS_KEY = 'petconnect.mock.pets'
const APPLICATIONS_KEY = 'petconnect.mock.applications'

function normalizeStatus(status) {
  const normalized = String(status || 'AVAILABLE').toUpperCase()
  if (normalized === 'AVAILABLE' || normalized === 'PENDING' || normalized === 'ADOPTED') {
    return normalized
  }
  return 'AVAILABLE'
}

function normalizeSize(size) {
  if (!size) return null
  return String(size).toUpperCase().replace(/\s+/g, '_')
}

function normalizePet(rawPet, species) {
  return {
    id: rawPet.id,
    name: rawPet.name,
    breed: rawPet.breed,
    age: typeof rawPet.age === 'number' ? rawPet.age : parseInt(rawPet.age, 10) || null,
    gender: rawPet.gender || null,
    size: species === 'DOG' ? normalizeSize(rawPet.size) : null,
    color: rawPet.color || null,
    imageUrl: rawPet.imageUrl || rawPet.img || '',
    status: normalizeStatus(rawPet.status),
    description: rawPet.description || rawPet.bio || '',
    goodWithKids: rawPet.goodWithKids ?? rawPet.goodWith?.youngKids ?? false,
    goodWithDogs: rawPet.goodWithDogs ?? rawPet.goodWith?.dogs ?? false,
    goodWithCats: rawPet.goodWithCats ?? rawPet.goodWith?.cats ?? false,
    indoorOutdoor: rawPet.indoorOutdoor || (species === 'CAT' ? 'INDOOR' : null),
    isVaccinated: rawPet.isVaccinated ?? false,
    shelter: rawPet.shelter || null,
    species,
    createdAt: rawPet.createdAt || new Date().toISOString(),
  }
}

function createInitialPets() {
  return [
    ...DOGS.map(dog => normalizePet(dog, 'DOG')),
    ...CATS.map(cat => normalizePet(cat, 'CAT')),
  ]
}

function readJson(key, fallbackFactory) {
  if (typeof window === 'undefined') return fallbackFactory()
  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    const fallback = fallbackFactory()
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    const fallback = fallbackFactory()
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getPets() {
  return readJson(PETS_KEY, createInitialPets)
}

export function savePets(pets) {
  writeJson(PETS_KEY, pets)
  return pets
}

export function getPetById(petId) {
  return getPets().find(pet => pet.id === petId) || null
}

export function updatePet(petId, updates) {
  const pets = getPets()
  const nextPets = pets.map(pet => (
    pet.id === petId
      ? { ...pet, ...updates, status: updates.status ? normalizeStatus(updates.status) : pet.status }
      : pet
  ))
  savePets(nextPets)
  return nextPets.find(pet => pet.id === petId) || null
}

export function getApplications() {
  return readJson(APPLICATIONS_KEY, () => [])
}

export function saveApplications(applications) {
  writeJson(APPLICATIONS_KEY, applications)
  return applications
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  const rawUser = window.localStorage.getItem('user')
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

function hydrateApplication(application, pets) {
  const pet = pets.find(item => item.id === application.petId) || null
  return {
    ...application,
    pet,
  }
}

export function listApplications({ currentUserOnly = false } = {}) {
  const pets = getPets()
  const currentUser = getCurrentUser()
  const applications = getApplications()
    .filter(application => {
      if (!currentUserOnly) return true
      if (!currentUser) return false
      if (currentUser.userId && application.user?.userId) {
        return application.user.userId === currentUser.userId
      }
      return application.user?.username === currentUser.username
    })
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(application => hydrateApplication(application, pets))

  return applications
}

export function createApplication({ petId, message }) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('You must be signed in to apply.')
  }

  const pet = getPetById(petId)
  if (!pet) {
    throw new Error('Pet not found.')
  }

  if (pet.status === 'PENDING') {
    throw new Error('This pet already has an application under review.')
  }

  if (pet.status === 'ADOPTED') {
    throw new Error('This pet has already been adopted.')
  }

  const applications = getApplications()
  const existingPending = applications.find(application =>
    application.petId === petId && application.status === 'PENDING'
  )

  if (existingPending) {
    throw new Error('This pet already has an application under review.')
  }

  const duplicateApplication = applications.find(application =>
    application.petId === petId &&
    application.user?.username === currentUser.username &&
    application.status === 'PENDING'
  )

  if (duplicateApplication) {
    throw new Error('You already have a pending application for this pet.')
  }

  const newApplication = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `app-${Date.now()}`,
    petId,
    message: message?.trim() || '',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    reviewedAt: null,
    user: {
      userId: currentUser.userId || null,
      username: currentUser.username || 'Applicant',
      email: currentUser.email || '',
      role: currentUser.role || 'USER',
    },
  }

  saveApplications([newApplication, ...applications])
  updatePet(petId, { status: 'PENDING' })

  return hydrateApplication(newApplication, getPets())
}

export function reviewApplication(applicationId, status) {
  const nextStatus = String(status || '').toUpperCase()
  if (!['APPROVED', 'DENIED'].includes(nextStatus)) {
    throw new Error('Invalid application status.')
  }

  const applications = getApplications()
  const selectedApplication = applications.find(application => application.id === applicationId)

  if (!selectedApplication) {
    throw new Error('Application not found.')
  }

  const reviewedAt = new Date().toISOString()
  const updatedApplications = applications.map(application => {
    if (application.id === applicationId) {
      return { ...application, status: nextStatus, reviewedAt }
    }

    if (
      nextStatus === 'APPROVED' &&
      application.petId === selectedApplication.petId &&
      application.status === 'PENDING'
    ) {
      return { ...application, status: 'DENIED', reviewedAt }
    }

    return application
  })

  saveApplications(updatedApplications)

  if (nextStatus === 'APPROVED') {
    updatePet(selectedApplication.petId, { status: 'ADOPTED' })
  } else {
    const hasOtherPendingOrApproved = updatedApplications.some(application =>
      application.id !== applicationId &&
      application.petId === selectedApplication.petId &&
      ['PENDING', 'APPROVED'].includes(application.status)
    )

    updatePet(selectedApplication.petId, {
      status: hasOtherPendingOrApproved ? 'PENDING' : 'AVAILABLE',
    })
  }

  return listApplications().find(application => application.id === applicationId) || null
}
