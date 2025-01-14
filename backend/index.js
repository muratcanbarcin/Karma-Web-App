// A basic Express server
const express = require('express');
const app = express();

// Default route to confirm server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Set the port and start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
