import os
import logging
from flask import Flask, request
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, CallbackContext
import asyncio

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

# Add handlers to the bot application
app_telegram.add_handler(CommandHandler("start", start))

async def set_webhook():
    """Set webhook for Telegram bot"""
    await bot.set_webhook(url=f"{WEBHOOK_URL}/{BOT_TOKEN}")

if __name__ == "__main__":
    asyncio.run(set_webhook())  # Properly awaiting set_webhook
    app.run(host="0.0.0.0", port=5000)
