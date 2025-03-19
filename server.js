const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");
require("dotenv").config();
const botFunctions = require("./bot"); // Import shared bot logic

const app = express();
const PORT = process.env.PORT || 3000;

// Get all bot tokens from .env and split them into an array
const botTokens = process.env.BOT_TOKENS ? process.env.BOT_TOKENS.split(",") : [];

if (botTokens.length === 0) {
    console.error("❌ No bot tokens found in .env file!");
    process.exit(1);
}

// Store all bot instances
const bots = [];

botTokens.forEach((token, index) => {
    const bot = new TelegramBot(token.trim(), { polling: true });

    // Load shared bot functions
    botFunctions(bot);

    console.log(`✅ Bot ${index + 1} is running with token: ${token.trim().slice(0, 5)}...`);

    bots.push(bot);
});

// Render Deploy Hook URL (Auto-refresh every 5 minutes)
const DEPLOY_HOOK_URL = "https://api.render.com/deploy/srv-cvdemdl2ng1s73dtdms0?key=kDv-523xHBg";

async function refreshBots() {
    try {
        const response = await axios.get(DEPLOY_HOOK_URL);
        console.log("✅ Deploy Hook Triggered:", response.data);
    } catch (error) {
        console.error("❌ Error Refreshing:", error.message);
    }
}

// Auto-refresh every 5 minutes
setInterval(refreshBots, 5 * 60 * 1000);

app.get("/", (req, res) => {
    res.send(`✅ ${bots.length} Telegram bots are running...`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
