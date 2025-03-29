module.exports = function (bot) { const securityTips = [ "🛡️ Use strong, unique passwords.", "🛡️ Enable two-factor authentication (2FA).", "🛡️ Avoid clicking on suspicious links.", "🛡️ Keep your software updated.", "🛡️ Never share personal details with strangers.", "🛡️ Always verify a website’s URL before entering credentials.", "🛡️ Use a VPN on public Wi-Fi.", "🛡️ Avoid using the same password across multiple sites.", "🛡️ Regularly check your bank statements for fraud.", "🛡️ Backup your important data frequently.", ];

const adminChatId = "7521256872"; // HackTechnologyX admin ID const userReports = {}; const scamReports = {}; const bannedUsers = new Set();

bot.onText(//start/, async (msg) => { const chatId = msg.chat.id; const firstName = msg.from.first_name || "User"; const username = msg.from.username ? @${msg.from.username} : "No Username"; const userId = msg.from.id; const userLang = msg.from.language_code || "Unknown";

if (bannedUsers.has(userId)) {
    bot.sendMessage(chatId, "❌ You have been banned from using this bot due to multiple scam reports.");
    return;
}

const welcomeMessage = `Hello ${firstName},\n\n🤖 This bot **ONLY** connects you with **trusted hackers** on Telegram.\n🔐 Plus, get **free tips** to stay safe online!\n\nChoose an option below:`;

const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "🔍 Get a Trusted Hacker", url: "https://t.me/Hacktechnologyx" }],
            [{ text: "🛡️ Free Security Tips", callback_data: "safety_tips" }],
            [{ text: "⚠️ Report a Scam", url: "https://t.me/Hacktechnologyx" }],
            [{ text: "✅ Verify a Person", callback_data: "verify_person" }],
            [{ text: "🔎 Request Security Audit", callback_data: "security_audit" }],
            [{ text: "🚨 Report a Fake Hacker", callback_data: "report_fake_hacker" }],
            [{ text: "📖 Cyber Security Fact", callback_data: "cyber_fact" }]
        ]
    }
};

bot.sendMessage(chatId, welcomeMessage, options);
bot.sendMessage(adminChatId, `🚀 **New User Started the Bot**\n\n👤 **User:** ${username}\n🆔 **ID:** ${userId}\n🌎 **Lang:** ${userLang}`);

});

bot.on("callback_query", async (query) => { const chatId = query.message.chat.id; const userId = query.from.id;

if (bannedUsers.has(userId)) {
    bot.sendMessage(chatId, "❌ You are banned from using this bot.");
    return;
}

switch (query.data) {
    case "safety_tips":
        const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
        bot.sendMessage(chatId, `🔐 **Security Tip:**\n${randomTip}`);
        break;
    case "verify_person":
        bot.sendMessage(chatId, "✅ **Provide the details for verification:**\n- Full Name\n- Telegram Username\n- Reason for Verification\n\n📩 Type your details below:");
        userReports[userId] = { type: "verify" };
        break;
    case "security_audit":
        bot.sendMessage(chatId, "🔎 **Describe what you need audited:**\n- Website URL\n- Security concerns\n\n📩 Type your details below:");
        userReports[userId] = { type: "audit" };
        break;
    case "report_fake_hacker":
        bot.sendMessage(chatId, "🚨 **Enter the scammer's details:**\n- Username/Contact Info\n- Proof of Scam\n\n📩 Type your details below:");
        userReports[userId] = { type: "fake_hacker" };
        break;
    case "cyber_fact":
        bot.sendMessage(chatId, "💡 **Cyber Security Fact:**\nOver 80% of hacking-related breaches are due to weak passwords. Use strong, unique passwords!");
        break;
}

bot.answerCallbackQuery(query.id);

});

bot.on("message", async (msg) => { const chatId = msg.chat.id; const userId = msg.from.id;

if (bannedUsers.has(userId)) return;

if (userReports[userId]) {
    const reportType = userReports[userId].type;
    const userMessage = msg.text;

    let adminMessage = `📩 **New Report Received!**\n🆔 **User ID:** ${userId}\n📝 **Details:** ${userMessage}`;
    bot.sendMessage(adminChatId, adminMessage)
        .then(() => bot.sendMessage(chatId, "✅ **Your report has been sent to the admin.**"))
        .catch(err => console.error("❌ Error sending report:", err.message));

    delete userReports[userId];
}

});

console.log("✅ Bot functions loaded successfully.");

};

