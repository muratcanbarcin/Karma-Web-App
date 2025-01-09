const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Database bağlantısı

// Tüm Accommodations verilerini getiren bir endpoint tanımlayın
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Accommodations');
        res.json(rows); // Veritabanından dönen tüm satırları JSON formatında döndür
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

module.exports = router;
