import os
from fastapi import FastAPI, Request
from telegram import Update, Bot, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Dispatcher, CommandHandler, CallbackContext
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TOKEN")
bot = Bot(token=TOKEN)
app = FastAPI()

@app.post("/webhook")
async def webhook(request: Request):
    update = Update.de_json(await request.json(), bot)
    dp.process_update(update)
    return "OK"

def start(update: Update, context: CallbackContext):
    buttons = [
        [InlineKeyboardButton("🕶 Contact an Expert", url="https://t.me/yourusername")],
        [InlineKeyboardButton("💀 Request Consultation", url="https://t.me/HacktechnologyX")],
        [InlineKeyboardButton("📜 FAQ / How It Works", callback_data="faq")],
        [InlineKeyboardButton("🔒 Latest Cyber Updates", callback_data="updates")],
        [InlineKeyboardButton("🕵️‍♂️ Anonymous Report", callback_data="report")],
    ]
    update.message.reply_text(
        "👁‍🗨 Welcome to the *Elite CyberSec Network*.\n"
        "We operate in the shadows, providing top-tier digital intelligence.\n"
        "Select an option below:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons)
    )

dp = Dispatcher(bot, None, workers=0)
dp.add_handler(CommandHandler("start", start))
