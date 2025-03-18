import os
import logging
from flask import Flask, request
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, CallbackContext
import asyncio

# Load environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")

# Ensure variables are not empty
if not BOT_TOKEN or not WEBHOOK_URL:
    raise ValueError("BOT_TOKEN or WEBHOOK_URL is missing! Check your environment variables.")

# Initialize Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize the bot
bot = Bot(token=BOT_TOKEN)

# Initialize the application
app_telegram = Application.builder().token(BOT_TOKEN).build()

@app.route("/", methods=["GET"])
def home():
    return "Telegram Bot is Running!", 200

@app.route(f"/{BOT_TOKEN}", methods=["POST"])
def webhook():
    update = Update.de_json(request.get_json(), bot)
    app_telegram.process_update(update)
    return "OK", 200

async def start(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("Hello! I am your support bot.")

app_telegram.add_handler(CommandHandler("start", start))

async def set_webhook():
    """Set webhook for Telegram bot"""
    logging.info(f"Setting webhook to: {WEBHOOK_URL}/{BOT_TOKEN}")  # Debug print
    await bot.set_webhook(url=f"{WEBHOOK_URL}/{BOT_TOKEN}")

if __name__ == "__main__":
    asyncio.run(set_webhook())  # Properly awaiting set_webhook
    app.run(host="0.0.0.0", port=5000)
