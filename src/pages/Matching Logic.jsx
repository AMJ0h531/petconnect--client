function matchPets(userPrefs, pets) {
  return pets.filter(pet => {
    return (
      pet.species === userPrefs.species &&
      pet.age <= userPrefs.maxAge &&
      pet.breed.includes(userPrefs.breed || "")
    );
  });
}
