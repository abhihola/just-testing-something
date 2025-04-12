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

botTokens.forEach(async (token, index) => {
    const bot = new TelegramBot(token.trim(), { polling: true });

    // Load shared bot functions
    botFunctions(bot);

    // Get bot name dynamically
    try {
        const botInfo = await bot.getMe();
        console.log(`✅ Bot ${index + 1} (@${botInfo.username}) is running.`);
    } catch (error) {
        console.error(`❌ Failed to fetch bot info for token ${token.trim().slice(0, 5)}...`);
    }

    bots.push(bot);
});

// Render Deploy Hook URL (Auto-refresh every 5 minutes)
const DEPLOY_HOOK_URL = "https://api.render.com/deploy/srv-cvt7sv3e5dus73a3m71g?key=0ER8jj_NTBk";

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
    console.log(` Server is running on port ${PORT}`);
});
