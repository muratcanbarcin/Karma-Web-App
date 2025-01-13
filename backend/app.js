const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const accommodationsRoutes = require("./routes/accommodations");
const usersRoutes = require("./routes/users");
require("dotenv").config();




const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());



app.use("/api/accommodations", accommodationsRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = app;
