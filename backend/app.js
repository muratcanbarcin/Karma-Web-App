const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const accommodationsRoutes = require('./routes/accommodations'); // Accommodations routes'u dahil ettik

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend is running. Use /api/accommodations to interact.');
});

// Accommodations route'u bağla
app.use('/api/accommodations', accommodationsRoutes);

// Server başlatma
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = app;
