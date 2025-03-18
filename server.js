const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Web route to check if the service is running
app.get("/", (req, res) => {
    res.send("Bot is running...");
});

// Start the web server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Start the bot
require("./bot.js");
