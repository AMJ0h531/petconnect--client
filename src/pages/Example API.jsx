router.post("/match", async (req, res) => {
  const pets = await Pet.findAll();
  const matches = matchPets(req.body, pets);
  res.json(matches);
});
