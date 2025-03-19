const express = require('express');
require('./bot'); // ✅ Ensure this is only imported ONCE

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ Telegram bot is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
