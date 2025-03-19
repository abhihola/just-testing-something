const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

if (!process.env.BOT_TOKEN) {
    console.error("❌ Error: BOT_TOKEN is missing in .env");
    process.exit(1);
}

// ✅ Declare the bot only once
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ✅ Welcome message
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";

    const welcomeMessage = `Hello ${firstName},\n\n🤖 This bot connects you with **trusted hackers** to assist you.\n🔐 Plus, get **free tips** to stay safe online!\n\nChoose an option below:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔍 Get a Trusted Hacker", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "🛡️ Free Safety Tips", callback_data: "safety_tips" }],
                [{ text: "⚠️ Report a Scam", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "🔍 Verify a Person", callback_data: "verify_person" }],
                [{ text: "📊 Request Security Audit", callback_data: "security_audit" }],
                [{ text: "🚨 Report a Fake Hacker", callback_data: "report_fake_hacker" }],
                [{ text: "🔐 Cyber Security Fact", callback_data: "cyber_fact" }]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

// ✅ Handle button clicks
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
    } else if (query.data === "verify_person") {
        bot.sendMessage(chatId, "🔍 To verify a person, please provide their Telegram username or details.");
    } else if (query.data === "security_audit") {
        bot.sendMessage(chatId, "📊 Requesting a security audit? Contact us at https://t.me/Hacktechnologyx.");
    } else if (query.data === "report_fake_hacker") {
        bot.sendMessage(chatId, "🚨 Report a fake hacker at https://t.me/Hacktechnologyx.");
    } else if (query.data === "cyber_fact") {
        const facts = [
            "🔐 Fact: 95% of cybersecurity breaches are due to human error.",
            "🔐 Fact: The first computer virus was created in 1986.",
            "🔐 Fact: Ransomware attacks have increased by 350% in the last 5 years.",
            "🔐 Fact: The strongest passwords are at least 16 characters long."
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        bot.sendMessage(chatId, randomFact);
    }

    bot.answerCallbackQuery(query.id);
});

console.log("✅ Bot is running...");
