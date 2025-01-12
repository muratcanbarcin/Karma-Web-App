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
    const [rows] = await pool.query(
      `SELECT AccommodationID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates, CreatedAt, UpdatedAt 
       FROM Accommodations 
       WHERE AccommodationID = ?`, 
      [id]
    );
    if (rows.length > 0) {
      const accommodation = rows[0];
      accommodation.image = "/105m2_934x700.webp"; // Default image
      res.json(accommodation);
    } else {
      res.status(404).json({ error: "Accommodation not found" });
    }
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT rr.Rating, rr.Comment, u.Name AS ReviewerName
      FROM RatingsAndReviews rr
      JOIN Bookings b ON rr.BookingID = b.BookingID
      JOIN Users u ON rr.ReviewerID = u.UserID
      WHERE b.AccommodationID = ?
      `,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch reviews:", err.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;
