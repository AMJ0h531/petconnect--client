router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    console.log("Payment successful");
    // mark application as paid
  }

  res.sendStatus(200);
});
