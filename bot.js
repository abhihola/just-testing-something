module.exports = function (bot) {
    const securityTips = [
        "🛡️ Use strong, unique passwords.",
        "🛡️ Enable two-factor authentication (2FA).",
        "🛡️ Avoid clicking on suspicious links.",
        "🛡️ Keep your software updated.",
        "🛡️ Never share personal details with strangers.",
        "🛡️ Always verify a website’s URL before entering credentials.",
        "🛡️ Use a VPN on public Wi-Fi.",
        "🛡️ Avoid using the same password across multiple sites.",
        "🛡️ Regularly check your bank statements for fraud.",
        "🛡️ Backup your important data frequently.",
    ];

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name || "User";
        const username = msg.from.username ? `@${msg.from.username}` : "N/A";
        const userId = msg.from.id;
        const countryCode = msg.from.language_code || "Unknown";

        // Get bot username
        const botInfo = await bot.getMe();
        const botName = botInfo.username;

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

        // 📩 Send Notification to HackTechnologyX
        const adminChatId = 7521256872; // 🔹 Correct admin chat ID
        const notificationMessage = `🚀 **New User Started Bot** 🚀\n\n👤 **Username:** ${username}\n🆔 **User ID:** ${userId}\n🌍 **Country Code:** ${countryCode}\n📛 **Name:** ${firstName}\n🤖 **Bot:** ${botName}`;

        bot.sendMessage(adminChatId, notificationMessage).catch((err) => {
            console.error("❌ Failed to notify HackTechnologyX:", err.message);
        });
    });

    bot.on("callback_query", (query) => {
        const chatId = query.message.chat.id;
        switch (query.data) {
            case "safety_tips":
                bot.sendMessage(chatId, `🔐 **Security Tip:**\n${securityTips[Math.floor(Math.random() * securityTips.length)]}`);
                break;
            case "verify_person":
                bot.sendMessage(chatId, "✅ **To verify a person, please provide their details to our trusted team.**\n\n📩 Contact: @Hacktechnologyx");
                break;
            case "security_audit":
                bot.sendMessage(chatId, "🔎 **Request a Security Audit**\n\nOur experts can audit your security. Contact us: @Hacktechnologyx");
                break;
            case "report_fake_hacker":
                bot.sendMessage(chatId, "🚨 **Report a Fake Hacker**\n\nIf you suspect a scammer, report them to: @Hacktechnologyx");
                break;
            case "cyber_fact":
                bot.sendMessage(chatId, "💡 **Cyber Security Fact:**\nDid you know? **Over 80% of hacking-related breaches are due to weak passwords.** Always use strong, unique passwords!");
                break;
        }
        bot.answerCallbackQuery(query.id);
    });

    console.log("✅ Bot functions loaded successfully.");
};
