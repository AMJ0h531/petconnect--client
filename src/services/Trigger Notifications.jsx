// Example: when application approved
const io = req.app.get("io");

io.emit("notification", {
  message: "Application approved!"
});

if (application.status === "APPROVED") {
  sendEmail();
  sendSMS();
}
