import os
import random
from dotenv import load_dotenv
from flask import Flask, request
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackContext, MessageHandler, filters

# Load environment variables
load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")  # Your Render app URL
REDIRECT_URL = os.getenv("REDIRECT_URL")  # Link for the button

app = Flask(__name__)

# Initialize bot
bot_app = Application.builder().token(TOKEN).build()

# Load tips from file
with open("tips.txt", "r", encoding="utf-8") as file:
    TIPS = file.readlines()

# Start command
async def start(update: Update, context: CallbackContext):
    keyboard = [[InlineKeyboardButton("Visit Website", url=REDIRECT_URL)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Welcome! Click the button below for more info.\n"
        "Use /tip to get a random scam prevention tip.",
        reply_markup=reply_markup
    )

# Send random tip
async def tip(update: Update, context: CallbackContext):
    await update.message.reply_text(random.choice(TIPS))

# Webhook endpoint
@app.route(f"/{TOKEN}", methods=["POST"])
def webhook():
    update = Update.de_json(request.get_json(), bot_app.bot)
    bot_app.update_queue.put(update)
    return "OK", 200

# Set webhook on startup
async def set_webhook():
    await bot_app.bot.set_webhook(f"{WEBHOOK_URL}/{TOKEN}")

# Run bot
if __name__ == "__main__":
    import threading

    # Start Flask server in a thread
    threading.Thread(target=lambda: app.run(host="0.0.0.0", port=5000)).start()
    
    # Run Telegram bot
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("tip", tip))
    bot_app.run_webhook(port=5000)
