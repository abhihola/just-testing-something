const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");
require("dotenv").config();
const botFunctions = require("./bot");

const app = express();
const PORT = process.env.PORT || 3000;

const botTokens = process.env.BOT_TOKENS ? process.env.BOT_TOKENS.split(",") : [];

if (botTokens.length === 0) {
    console.error("❌ No bot tokens found in .env file!");
    process.exit(1);
}

const bots = [];
let firstBotInfo = null;

// Function to sync bot profile picture
async function syncBotProfilePicture(mainBot, bot) {
    try {
        const botInfo = await mainBot.getMe();
        const botUserId = botInfo.id; // Correctly fetch the bot's ID

        const photos = await mainBot.getUserProfilePhotos(botUserId); // Now it has the correct user ID
        if (photos.total_count > 0) {
            const fileId = photos.photos[0][0].file_id;
            const file = await mainBot.getFile(fileId);
            const fileUrl = `https://api.telegram.org/file/bot${botTokens[0].trim()}/${file.file_path}`;

            // Download profile picture
            const fileResponse = await axios.get(fileUrl, { responseType: "arraybuffer" });
            const fileBuffer = Buffer.from(fileResponse.data, "binary");

            // Upload the same profile picture to the bot
            await bot.setUserProfilePhotos({ photo: fileBuffer });
        }

        console.log(`✅ Synced profile picture for ${botInfo.username}`);
    } catch (error) {
        console.error("❌ Error syncing bot profile picture:", error.message);
    }
}

// Initialize bots asynchronously
async function initializeBots() {
    for (let index = 0; index < botTokens.length; index++) {
        const token = botTokens[index].trim();
        const bot = new TelegramBot(token, { polling: true });

        botFunctions(bot);

        try {
            const botInfo = await bot.getMe();
            console.log(`✅ Bot ${index + 1} (@${botInfo.username}) is running.`);

            bots.push(bot);

            // Sync all other bots with the first bot's profile picture
            if (index === 0) {
                firstBotInfo = bot;
            } else {
                await syncBotProfilePicture(firstBotInfo, bot);
            }
        } catch (error) {
            console.error(`❌ Failed to fetch bot info for token ${token.slice(0, 5)}...`, error.message);
        }
    }
}

// Start bot initialization
initializeBots();

// Render Deploy Hook URL (Auto-refresh every 5 minutes)
const DEPLOY_HOOK_URL = "https://api.render.com/deploy/srv-cveud62n91rc73aqae2g?key=UjWzaiTyytQ";

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
