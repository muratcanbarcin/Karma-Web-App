const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT AccommodationID, Location, DailyPointCost, Description
      FROM Accommodations
    `);

    const accommodations = rows.map((row) => ({
      ...row,
      image: "/105m2_934x700.webp",
    }));

    res.json(accommodations);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

router.post("/search", async (req, res) => {
  const { location, pointsRange } = req.body;

  try {
    const query = `
      SELECT AccommodationID, Location, DailyPointCost, Description
      FROM Accommodations
      WHERE Location LIKE ?
      AND DailyPointCost BETWEEN ? AND ?
    `;
    const [results] = await pool.query(query, [
      `%${location || ""}%`,
      pointsRange ? pointsRange[0] : 0,
      pointsRange ? pointsRange[1] : 1000000,
    ]);

    const accommodations = results.map((row) => ({
      ...row,
      image: "/105m2_934x700.webp",
    }));

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT AccommodationID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates
      FROM Accommodations
      WHERE AccommodationID = ?
    `, [id]);

    if (rows.length > 0) {
      const accommodation = rows[0];
      accommodation.image = "/105m2_934x700.webp";
      res.json(accommodation);
    } else {
      res.status(404).json({ error: "Accommodation not found" });
    }
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

module.exports = router;
