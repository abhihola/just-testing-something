const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";

    const welcomeMessage = `Hello ${firstName},\n\n🤖 This bot connects you with **trusted hackers** to assist you.\n🔐 Plus, get **free tips** to stay safe online!\n\nChoose an option below:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔍 Get a Trusted Hacker", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "🛡️ Free Safety Tips", callback_data: "safety_tips" }],
                [{ text: "⚠️ Report a Scam", url: "https://t.me/Hacktechnologyx" }]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "safety_tips") {
        const tips = [
            "🛡️ Use strong, unique passwords.",
            "🛡️ Enable 2FA on all accounts.",
            "🛡️ Avoid clicking suspicious links.",
            "🛡️ Keep your software updated.",
            "🛡️ Never share personal details with strangers."
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        bot.sendMessage(chatId, randomTip);
    }

    bot.answerCallbackQuery(query.id);
});

console.log("Bot is running...");
