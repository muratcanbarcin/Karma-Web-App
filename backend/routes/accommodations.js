const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Database bağlantısı

// Tüm Accommodations verilerini getiren endpoint
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Accommodations');
        res.json(rows);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Search endpoint
router.post('/search', async (req, res) => {
    const { location, pointsRange } = req.body;

    try {
        const query = `
            SELECT * FROM Accommodations
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
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Database query failed' });
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
