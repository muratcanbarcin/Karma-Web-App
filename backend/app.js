const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const accommodationsRoutes = require("./routes/accommodations");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend is running. Use /api/accommodations to interact.");
});

app.use("/api/accommodations", accommodationsRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = app;
