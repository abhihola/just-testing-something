const TelegramBot = require('node-telegram-bot-api'); const express = require('express'); require('dotenv').config();

const app = express(); const PORT = process.env.PORT || 3000;

// Get all bot tokens from .env and split them into an array const botTokens = process.env.BOT_TOKENS ? process.env.BOT_TOKENS.split(',') : [];

if (botTokens.length === 0) { console.error('❌ No bot tokens found in .env file!'); process.exit(1); }

// Store all bot instances const bots = [];

botTokens.forEach((token, index) => { const bot = new TelegramBot(token.trim(), { polling: true });

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, `Hello! I am Bot ${index + 1}`);
});

console.log(`✅ Bot ${index + 1} is running with token: ${token.trim().slice(0, 5)}...`);

bots.push(bot);

});

app.get('/', (req, res) => { res.send(✅ ${bots.length} Telegram bots are running...); });

app.listen(PORT, () => { console.log(🚀 Server is running on port ${PORT}); });

