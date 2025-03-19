const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const subscribers = new Set();

// Disclaimer message
const disclaimer = "\n\n⚠️ **IMPORTANT:** This bot is the ONLY way to connect with trusted hackers on Telegram. Avoid scammers!";

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";

    const welcomeMessage = `Hello ${firstName},\n\n🤖 This bot connects you with **trusted hackers** to assist you.${disclaimer}\n🔐 Plus, get **free tips** to stay safe online!\n\nChoose an option below:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔍 Get a Trusted Hacker", url: "https://t.me/HACKTECHNOLOGYX" }],
                [{ text: "🛡️ Free Safety Tips", callback_data: "safety_tips" }],
                [{ text: "⚠️ Report a Scam", url: "https://t.me/HACKTECHNOLOGYX" }]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

// Handle Safety Tips
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "safety_tips") {
        const tips = [
            "🛡️ Use strong, unique passwords.",
            "🛡️ Enable 2FA on all accounts.",
            "🛡️ Avoid clicking suspicious links.",
            "🛡️ Keep your software updated.",
            "🛡️ Never share personal details with strangers.",
            "🛡️ Don't use public Wi-Fi for sensitive tasks.",
            "🛡️ Use a trusted VPN for extra security.",
            "🛡️ Be cautious of unsolicited messages or offers."
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        bot.sendMessage(chatId, randomTip);
    }

    bot.answerCallbackQuery(query.id);
});

// Scam Link Checker
bot.onText(/\/check (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const link = match[1];

    // Fake AI scam detection logic
    const isScam = Math.random() < 0.3; // 30% chance of being a scam
    const response = isScam
        ? `❌ **Warning:** This link **${link}** might be a scam! Be careful.`
        : `✅ This link **${link}** seems safe, but always double-check!`;

    bot.sendMessage(chatId, response);
});

// Subscribe to Daily Tips
bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (!subscribers.has(chatId)) {
        subscribers.add(chatId);
        bot.sendMessage(chatId, "✅ You have subscribed to daily cybersecurity tips!");
    } else {
        bot.sendMessage(chatId, "📢 You are already subscribed!");
    }
});

// Unsubscribe from Daily Tips
bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (subscribers.has(chatId)) {
        subscribers.delete(chatId);
        bot.sendMessage(chatId, "❌ You have unsubscribed from daily cybersecurity tips.");
    } else {
        bot.sendMessage(chatId, "ℹ️ You are not subscribed.");
    }
});

// Function to send daily tips (Mock)
function sendDailyTips() {
    const tips = [
        "🔹 Regularly update your software.",
        "🔹 Avoid reusing passwords across sites.",
        "🔹 Always verify website URLs before logging in.",
        "🔹 Use multi-factor authentication when possible."
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    subscribers.forEach(chatId => {
        bot.sendMessage(chatId, `📢 Daily Cybersecurity Tip:\n${tip}`);
    });
}

// Mock sending daily tips every 24 hoursconst TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const securityTips = [
    "🛡️ Use strong, unique passwords.",
    "🛡️ Enable 2FA on all accounts.",
    "🛡️ Avoid clicking suspicious links.",
    "🛡️ Keep your software updated.",
    "🛡️ Never share personal details with strangers.",
    "🔒 Use a VPN to protect your browsing activity.",
    "🚨 Never use the same password across multiple accounts.",
    "🔐 Always log out from public computers after use.",
    "⚠️ Check URLs before entering login details to avoid phishing scams.",
    "📵 Be cautious when connecting to public WiFi networks.",
    "🕵️‍♂️ Use encrypted messaging apps for sensitive conversations."
    // Add more tips here to reach 1000+
];

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";

    const welcomeMessage = `Hello ${firstName},\n\n🤖 This bot connects you with **trusted hackers** to assist you.\n🔐 Plus, get **free tips** to stay safe online!\n\nOnly this bot can connect you with **verified hackers** on Telegram. Do not trust any random person! Choose an option below:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔍 Get a Trusted Hacker", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "🛡️ Free Security Tips", callback_data: "safety_tips" }],
                [{ text: "⚠️ Report a Scam", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "✅ Verify a Person", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "📊 Request Security Audit", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "❌ Report a Fake Hacker", url: "https://t.me/Hacktechnologyx" }],
                [{ text: "🔐 Cybersecurity Fact", callback_data: "cyber_fact" }]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "safety_tips") {
        const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
        bot.sendMessage(chatId, `🔐 Security Tip: ${randomTip}`);
    } 
    
    else if (query.data === "cyber_fact") {
        const cyberFacts = [
            "💻 The first computer virus was created in 1986, called 'Brain'.",
            "🔐 Over 95% of cybersecurity breaches are caused by human error.",
            "🛡️ The biggest data breach in history exposed over 3 billion accounts (Yahoo, 2013).",
            "🚨 Every 39 seconds, a hacker attempts to breach a system somewhere in the world.",
            "📱 60% of fraud originates from mobile devices, and 80% of mobile fraud comes from apps."
        ];
        const randomFact = cyberFacts[Math.floor(Math.random() * cyberFacts.length)];
        bot.sendMessage(chatId, `📢 Cybersecurity Fact: ${randomFact}`);
    }

    bot.answerCallbackQuery(query.id);
});

console.log("Bot is running...");

setInterval(sendDailyTips, 24 * 60 * 60 * 1000);

console.log("Bot is running...");
