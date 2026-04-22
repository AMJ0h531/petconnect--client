// src/data/mockData.js
// Mock pet data — replaces backend API calls so the app works without a server

export const DOGS = [
  {
    id: 'luna', name: 'Luna', type: 'Dog', breed: 'Labrador Mix',
    age: '2 years', gender: 'Female', size: 'Large', color: 'Golden',
    img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&q=80',
    status: 'available',
    tags: ['Good with kids','Dog friendly','Cat friendly','Outdoor lover','Leash trained'],
    bio: `Luna is an absolute ray of sunshine wrapped in golden fur. She arrived already house-trained, leash-savvy, and full of love. She gets along beautifully with children and other dogs, and has been successfully cat-tested at the shelter.`,
    traits: ['Affectionate','Energetic','Playful','Curious','Loyal','Social'],
    goodWith: { youngKids:true, dogs:true, cats:true, apartment:false, outdoorSpace:true, olderKids:true },
    shelter: { name:'Happy Paws Shelter', address:'123 Main St, Columbus, OH 43215', phone:'(614) 555-0199', email:'adopt@happypaws.org', hours:'Mon–Sat 9am–6pm · Sun 11am–4pm' },
  },
  {
    id: 'buddy', name: 'Buddy', type: 'Dog', breed: 'Border Collie Mix',
    age: '3 years', gender: 'Male', size: 'Medium', color: 'Black & White',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80',
    status: 'available',
    tags: ['Good with kids','Dog friendly','Indoor','Smart','Trainable'],
    bio: `Buddy is brilliantly intelligent — he mastered sit, stay, come, shake, and roll-over within his first week at the shelter. He needs a home that can channel that brilliant mind with puzzles, agility, and long hikes.`,
    traits: ['Intelligent','Loyal','Energetic','Focused','Playful','Alert'],
    goodWith: { youngKids:false, dogs:true, cats:false, apartment:false, outdoorSpace:true, olderKids:true },
    shelter: { name:'Happy Paws Shelter', address:'123 Main St, Columbus, OH 43215', phone:'(614) 555-0199', email:'adopt@happypaws.org', hours:'Mon–Sat 9am–6pm · Sun 11am–4pm' },
  },
  {
    id: 'max', name: 'Max', type: 'Dog', breed: 'Golden Retriever',
    age: '1 year', gender: 'Male', size: 'Large', color: 'Golden',
    img: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500&q=80',
    status: 'available',
    tags: ['Puppy','Playful','Good with kids','Eager to please'],
    bio: `Max is boundless joy in a fluffy golden package. Already house-trained and knows basic commands. He loves everyone — children, adults, strangers. Currently fostered with a toddler and two cats and has been an absolute gentleman.`,
    traits: ['Gentle','Friendly','Eager','Loving','Patient','Adaptable'],
    goodWith: { youngKids:true, dogs:true, cats:true, apartment:false, outdoorSpace:true, olderKids:true },
    shelter: { name:'Happy Paws Shelter', address:'123 Main St, Columbus, OH 43215', phone:'(614) 555-0199', email:'adopt@happypaws.org', hours:'Mon–Sat 9am–6pm · Sun 11am–4pm' },
  },
]

export const CATS = [
  {
    id: 'mittens', name: 'Mittens', type: 'Cat', breed: 'Tabby Mix',
    age: '4 years', gender: 'Female', size: 'Medium', color: 'Orange Tabby',
    img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=500&q=80',
    status: 'available',
    tags: ['Good with kids','Dog friendly','Cat friendly','Indoor','Calm'],
    bio: `Mittens is a confident, curious cat who enjoys sunny windowsills and the occasional dramatic flop on your laptop keyboard. Dog-tested and cat-tested, making her ideal for a multi-pet household.`,
    traits: ['Independent','Affectionate','Curious','Calm','Confident','Gentle'],
    goodWith: { youngKids:true, dogs:true, cats:true, apartment:true, outdoorSpace:false, olderKids:true },
    shelter: { name:'Citywide Cat Rescue', address:'456 Oak Ave, Columbus, OH 43202', phone:'(614) 555-0211', email:'adopt@citywidecat.org', hours:'Tue–Sun 10am–5pm' },
  },
  {
    id: 'whiskers', name: 'Whiskers', type: 'Cat', breed: 'Domestic Shorthair',
    age: '2 years', gender: 'Male', size: 'Medium', color: 'Black & White',
    img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500&q=80',
    status: 'available',
    tags: ['Calm','Indoor','Cuddly','Lap cat','Quiet'],
    bio: `Whiskers is the cat equivalent of a warm cup of tea — utterly comforting and endlessly cozy. One of the most affectionate cats in the shelter. A true lap cat who will make your home feel complete.`,
    traits: ['Calm','Cuddly','Gentle','Quiet','Devoted','Sweet'],
    goodWith: { youngKids:false, dogs:true, cats:false, apartment:true, outdoorSpace:false, olderKids:true },
    shelter: { name:'Citywide Cat Rescue', address:'456 Oak Ave, Columbus, OH 43202', phone:'(614) 555-0211', email:'adopt@citywidecat.org', hours:'Tue–Sun 10am–5pm' },
  },
  {
    id: 'cleo', name: 'Cleo', type: 'Cat', breed: 'Siamese Mix',
    age: '3 years', gender: 'Female', size: 'Medium', color: 'Seal Point',
    img: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=500&q=80',
    status: 'available',
    tags: ['Vocal','Playful','Dog friendly','Interactive','Bold'],
    bio: `Cleo does not do subtle. She has opinions about everything and will tell you in her distinctive melodious voice. Under that diva exterior is a deeply affectionate, fiercely loyal cat who bonds hard with her person.`,
    traits: ['Vocal','Bold','Intelligent','Loyal','Playful','Opinionated'],
    goodWith: { youngKids:false, dogs:true, cats:false, apartment:true, outdoorSpace:false, olderKids:true },
    shelter: { name:'Citywide Cat Rescue', address:'456 Oak Ave, Columbus, OH 43202', phone:'(614) 555-0211', email:'adopt@citywidecat.org', hours:'Tue–Sun 10am–5pm' },
  },
]

export const ALL_PETS = [...DOGS, ...CATS]

// Helper — mimics an API response shape { data: [...] }
const mockResponse = (data) => Promise.resolve({ data })

// Drop-in replacements for dogService and catService methods
export const mockDogService = {
  getAll:      () => mockResponse(DOGS),
  getFeatured: () => mockResponse(DOGS),
  getById:     (id) => mockResponse(DOGS.find(d => d.id === id) || null),
  search:      (query) => mockResponse(DOGS.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.breed.toLowerCase().includes(query.toLowerCase())
  )),
  getMatches:  () => mockResponse(DOGS),
  create: () => mockResponse({}),
  update: () => mockResponse({}),
  delete: () => mockResponse({}),
}

export const mockCatService = {
  getAll:      () => mockResponse(CATS),
  getFeatured: () => mockResponse(CATS),
  getById:     (id) => mockResponse(CATS.find(c => c.id === id) || null),
  search:      (query) => mockResponse(CATS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.breed.toLowerCase().includes(query.toLowerCase())
  )),
  getMatches:  () => mockResponse(CATS),
  create: () => mockResponse({}),
  update: () => mockResponse({}),
  delete: () => mockResponse({}),
}