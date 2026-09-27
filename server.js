const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "Unknown Service";

app.get("/", (req, res) => {
  res.json({
    message: `Hello from ${SERVICE_NAME}`,
    port: PORT,
  });
});

app.get("/health", (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: "healthy",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
