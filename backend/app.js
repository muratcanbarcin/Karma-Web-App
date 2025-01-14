// Express server setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const accommodationsRoutes = require("./routes/accommodations"); // Routes for accommodations
const usersRoutes = require("./routes/users"); // Routes for users
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Serve static files (e.g., images)
app.use("/images", express.static("public"));

// Register API routes
app.use("/api/accommodations", accommodationsRoutes);
app.use("/api/users", usersRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = app;
