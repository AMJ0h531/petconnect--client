const checkout = async () => {
  const res = await api.post("/payments/create-checkout", {
    petName: "Buddy",
    amount: 50
  });

  window.location.href = res.data.url;
};
