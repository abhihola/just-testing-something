const express = require("express");
const axios = require("axios");
require("./bot"); // ✅ Ensure this is only imported ONCE

const app = express();
const PORT = process.env.PORT || 3000;

// Render Deploy Hook URL (Auto-refresh every 5 minutes)
const DEPLOY_HOOK_URL = "https://api.render.com/deploy/srv-cvdemdl2ng1s73dtdms0?key=kDv-523xHBg";

async function refreshBot() {
    try {
        const response = await axios.get(DEPLOY_HOOK_URL);
        console.log("✅ Deploy Hook Triggered:", response.data);
    } catch (error) {
        console.error("❌ Error Refreshing:", error.message);
    }
}

// Auto-refresh every 5 minutes
setInterval(refreshBot, 5 * 60 * 1000);

app.get("/", (req, res) => {
    res.send("✅ Telegram bot is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
