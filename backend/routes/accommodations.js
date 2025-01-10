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
    const { location, pointsRange, availableDates } = req.body;

    if (!availableDates || !availableDates.start || !availableDates.end) {
        return res.status(400).json({ error: 'Start and end dates are required for search.' });
    }

    const startDate = availableDates.start;
    const endDate = availableDates.end;

    try {
        const [results] = await pool.query(`
            SELECT * FROM Accommodations
            WHERE Location LIKE ?
            AND DailyPointCost BETWEEN ? AND ?
            AND JSON_LENGTH(JSON_EXTRACT(AvailableDates, '$')) >= (
                SELECT COUNT(*)
                FROM JSON_TABLE(
                    JSON_ARRAY(?),
                    "$[*]" COLUMNS (date VARCHAR(10) PATH "$")
                ) AS requiredDates
                WHERE JSON_CONTAINS(JSON_EXTRACT(AvailableDates, '$'), JSON_QUOTE(requiredDates.date))
            )
        `, [
            `%${location || ''}%`,
            pointsRange ? pointsRange[0] : 0,
            pointsRange ? pointsRange[1] : 1000000,
            generateDateRange(startDate, endDate).join('","'),
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
