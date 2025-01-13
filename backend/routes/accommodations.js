const express = require("express");
const router = express.Router();
const pool = require("../database/connection");
const jwt = require('jsonwebtoken'); // Eksik olan import
const SECRET_KEY = process.env.SECRET_KEY;



router.get("/myAccommodations", async (req, res) => {
  try {
    // Token kontrolü
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Token çözümleme
    const decoded = jwt.verify(token, SECRET_KEY);
    const userID = decoded.userID;
    

    if (!userID) {
      return res.status(400).json({ error: "UserID not found in token." });
    }

    // Veritabanı sorgusu
    const query = `
      SELECT AccommodationID, Title, Description, Location, DailyPointCost
      FROM Accommodations
      WHERE UserID = ?
    `;
    const [rows] = await pool.query(query, [userID]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No accommodations found for this user." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error in /myAccommodations endpoint:", err.message);
    return res.status(500).json({ error: "Internal server error" });
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










router.post("/add", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const userID = decoded.userID; // `userID` buradan alınacak

    if (!userID) {
      console.error("UserID missing in token");
      return res.status(400).json({ error: "UserID missing in token." });
    }

    const {
      Title,
      Description,
      Location,
      Amenities,
      HouseRules,
      DailyPointCost,
      AvailableDates,
    } = req.body;

    const query = `
      INSERT INTO Accommodations (UserID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      userID,
      Title,
      Description,
      Location,
      JSON.stringify(Amenities),
      JSON.stringify(HouseRules),
      DailyPointCost,
      JSON.stringify(AvailableDates),
    ]);

    res.status(201).json({ message: "Accommodation added successfully!" });
  } catch (err) {
    console.error("Error adding accommodation:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  let currentUserID = null;

  try {
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      currentUserID = decoded.userID; // Token'dan kullanıcı ID'sini al
    }

    const query = `
      SELECT AccommodationID, UserID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates, CreatedAt, UpdatedAt 
      FROM Accommodations 
      WHERE AccommodationID = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    const accommodation = rows[0];
    accommodation.image = "/105m2_934x700.webp"; // Varsayılan görsel ekle

    // Ekstra bir alan ekliyoruz: Kullanıcı bu konaklamanın sahibi mi?
    accommodation.isOwner = accommodation.UserID === currentUserID;

    res.status(200).json(accommodation);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});



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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userID = decoded.userID;

    // Kullanıcının bu konaklamanın sahibi olup olmadığını kontrol et
    const checkQuery = `SELECT UserID FROM Accommodations WHERE AccommodationID = ?`;
    const [checkRows] = await pool.query(checkQuery, [id]);

    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Accommodation not found." });
    }

    if (checkRows[0].UserID !== userID) {
      return res.status(403).json({ error: "You are not authorized to edit this accommodation." });
    }

    const {
      Title,
      Description,
      Location,
      Amenities,
      HouseRules,
      DailyPointCost,
      AvailableDates,
    } = req.body;

    const updateQuery = `
      UPDATE Accommodations
      SET Title = ?, Description = ?, Location = ?, Amenities = ?, HouseRules = ?, DailyPointCost = ?, AvailableDates = ?
      WHERE AccommodationID = ? AND UserID = ?
    `;

    await pool.query(updateQuery, [
      Title,
      Description,
      Location,
      JSON.stringify(Amenities),
      JSON.stringify(HouseRules),
      DailyPointCost,
      JSON.stringify(AvailableDates),
      id,
      userID,
    ]);

    res.status(200).json({ message: "Accommodation updated successfully!" });
  } catch (err) {
    console.error("Error updating accommodation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
