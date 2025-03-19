const express = require('express');
const bot = require('./bot'); // Import bot.js

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Telegram bot is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
