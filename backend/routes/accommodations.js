const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Database bağlantısı

// Tüm Accommodations verilerini getiren endpoint
router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT AccommodationID, Location, DailyPointCost, Description
        FROM Accommodations
      `);
  
      // Tüm kayıtlar için varsayılan görsel ekliyoruz
      const accommodations = rows.map((row) => ({
        ...row,
        image: "/105m2_934x700.webp", // Varsayılan görsel
      }));
  
      res.json(accommodations);
    } catch (err) {
      console.error("Database query failed:", err.message);
      res.status(500).json({ error: "Database query failed", details: err.message });
    }
  });
  
  

// Search endpoint
router.post('/search', async (req, res) => {
    const { location, pointsRange } = req.body;
  
    try {
      const query = `
        SELECT AccommodationID, Location, DailyPointCost, bedrooms, bathrooms, size, Description, image 
        FROM Accommodations
        WHERE Location LIKE ?
        AND DailyPointCost BETWEEN ? AND ?
      `;
      const [results] = await pool.query(query, [
        `%${location || ''}%`,
        pointsRange ? pointsRange[0] : 0,
        pointsRange ? pointsRange[1] : 2000,
      ]);
      res.status(200).json(results);
    } catch (err) {
      console.error("Database query failed:", err);
      res.status(500).json({ error: "Database query failed" });
    }
  });
  

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await pool.query(`
        SELECT AccommodationID, Location, DailyPointCost, Description
        FROM Accommodations
        WHERE AccommodationID = ?
      `, [id]);
  
      if (rows.length > 0) {
        const accommodation = rows[0];
        // image alanı veritabanında yok, varsayılan görseli ekliyoruz
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
  
  
  
  



// Tarih aralığı üreten yardımcı fonksiyon
function generateDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    while (startDate <= endDate) {
        dateArray.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
}

module.exports = router;
