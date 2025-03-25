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

    const adminChatId = "7521256872"; // Replace with the actual admin chat ID
    const userReports = {}; // Store user reports temporarily

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name || "User";

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
    });

    // 🔘 Handle Button Clicks
    bot.on("callback_query", async (query) => {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const username = query.from.username ? `@${query.from.username}` : "No Username";

        switch (query.data) {
            case "safety_tips":
                const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
                bot.sendMessage(chatId, `🔐 **Security Tip:**\n${randomTip}`);
                break;

            case "verify_person":
                bot.sendMessage(chatId, "✅ **Please provide the full details of the person you want to verify.**\nExample:\n- Full Name\n- Telegram Username\n- Reason for Verification\n\n📩 Type your details below:");
                userReports[userId] = { type: "verify", username };
                break;

            case "security_audit":
                bot.sendMessage(chatId, "🔎 **Please describe what you need audited.**\nExample:\n- Website URL\n- System details\n- Security concerns\n\n📩 Type your details below:");
                userReports[userId] = { type: "audit", username };
                break;

            case "report_fake_hacker":
                bot.sendMessage(chatId, "🚨 **Please provide details about the fake hacker.**\nExample:\n- Username/Contact Info\n- Proof of Scam\n- Any extra details\n\n📩 Type your details below:");
                userReports[userId] = { type: "fake_hacker", username };
                break;

            case "cyber_fact":
                bot.sendMessage(chatId, "💡 **Cyber Security Fact:**\nDid you know? **Over 80% of hacking-related breaches are due to weak passwords.** Always use strong, unique passwords!");
                break;
        }

        bot.answerCallbackQuery(query.id);
    });

    // 🔥 Handle User Responses After Clicking a Button
    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (userReports[userId]) {
            const reportType = userReports[userId].type;
            const username = userReports[userId].username;
            const userMessage = msg.text;

            let adminMessage = `📩 **New Report Received!**\n👤 **From:** ${username}\n🆔 **User ID:** ${userId}\n📝 **Details:** ${userMessage}`;

            if (reportType === "verify") {
                adminMessage = `✅ **Verification Request**\n👤 **From:** ${username}\n📝 **Details:**\n${userMessage}`;
            } else if (reportType === "audit") {
                adminMessage = `🔎 **Security Audit Request**\n👤 **From:** ${username}\n📝 **Details:**\n${userMessage}`;
            } else if (reportType === "fake_hacker") {
                adminMessage = `🚨 **Fake Hacker Report**\n👤 **From:** ${username}\n📝 **Details:**\n${userMessage}`;
            }

            // Send report to admin
            bot.sendMessage(adminChatId, adminMessage)
                .then(() => bot.sendMessage(chatId, "✅ **Your report has been sent to the admin. They will review it soon!**"))
                .catch(err => console.error("❌ Error sending report to admin:", err.message));

            // Remove user from the report queue
            delete userReports[userId];
        }
    });

    console.log("✅ Bot functions loaded successfully.");
};
