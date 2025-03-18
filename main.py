import os
import logging
from flask import Flask, request
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, CallbackContext

# Load environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")

# Initialize Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize the bot
bot = Bot(token=BOT_TOKEN)

# Initialize the application
app_telegram = Application.builder().token(BOT_TOKEN).build()

# Root route to confirm bot is running
@app.route("/", methods=["GET"])
def home():
    return "Telegram Bot is Running!", 200

# Webhook route to handle Telegram updates
@app.route(f"/{BOT_TOKEN}", methods=["POST"])
def webhook():
    update = Update.de_json(request.get_json(), bot)
    app_telegram.process_update(update)
    return "OK", 200

# Command to handle /start
async def start(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("Hello! I am your support bot.")

# Command to provide security tips
async def tips(update: Update, context: CallbackContext) -> None:
    security_tips = [
        "Use strong, unique passwords for each service.",
        "Enable two-factor authentication (2FA) on all accounts.",
        "Beware of phishing emails and links.",
        "Keep your software and apps updated.",
        "Never share personal details with unverified contacts."
    ]
    await update.message.reply_text(random.choice(security_tips))

# Command to send a button linking to a URL
async def support(update: Update, context: CallbackContext) -> None:
    from telegram import InlineKeyboardButton, InlineKeyboardMarkup

    support_url = os.getenv("SUPPORT_URL", "https://example.com")
    keyboard = [[InlineKeyboardButton("Get Support", url=support_url)]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text("Click the button below for support:", reply_markup=reply_markup)

# Add handlers to the bot application
app_telegram.add_handler(CommandHandler("start", start))
app_telegram.add_handler(CommandHandler("tips", tips))
app_telegram.add_handler(CommandHandler("support", support))

# Start the webhook when running the script
if __name__ == "__main__":
    bot.set_webhook(url=f"{WEBHOOK_URL}/{BOT_TOKEN}")
    app.run(host="0.0.0.0", port=5000)
