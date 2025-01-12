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
    const [accommodationRows] = await pool.query(
      `SELECT AccommodationID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates, CreatedAt, UpdatedAt
       FROM Accommodations 
       WHERE AccommodationID = ?`,
      [id]
    );

    if (accommodationRows.length > 0) {
      const accommodation = accommodationRows[0];
      accommodation.image = "/105m2_934x700.webp"; // Default image

      // Average Rating Query
      const [ratingRows] = await pool.query(
        `SELECT AVG(Rating) AS AverageRating 
         FROM RatingsAndReviews rr
         JOIN Bookings b ON rr.BookingID = b.BookingID
         WHERE b.AccommodationID = ?`,
        [id]
      );

      accommodation.AverageRating = ratingRows[0]?.AverageRating
        ? parseFloat(ratingRows[0].AverageRating).toFixed(2) // Virgülden sonra 2 basamak
        : "No ratings yet";


      res.json(accommodation);
    } else {
      res.status(404).json({ error: "Accommodation not found" });
    }
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});




router.post("/:id/reviews", async (req, res) => {
  const { id } = req.params; // AccommodationID
  const { BookingID, ReviewerID, Rating, Comment } = req.body;

  if (!BookingID || !ReviewerID || !Rating || !Comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // BookingID ve AccommodationID eşleşmesini doğrula
    const [bookingCheck] = await pool.query(
      `SELECT BookingID FROM Bookings WHERE BookingID = ? AND AccommodationID = ?`,
      [BookingID, id]
    );

    if (bookingCheck.length === 0) {
      return res.status(400).json({ error: "Invalid BookingID for this Accommodation." });
    }

    // Review ekle
    await pool.query(
      `INSERT INTO RatingsAndReviews (BookingID, ReviewerID, RevieweeID, Rating, Comment, CreatedAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [BookingID, ReviewerID, id, Rating, Comment]
    );

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (err) {
    console.error("Failed to submit review:", err.message);
    res.status(500).json({ error: "Failed to submit review." });
  }
});






module.exports = router;
