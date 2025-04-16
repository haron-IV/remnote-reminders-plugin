import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import TelegramBot from 'node-telegram-bot-api'
import { RemindersModel } from './schemas.js'

const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `This is your chat id "${msg.chat.id}" you have to paste it to Remnote plugin settings. It is id of our chat, you will get notifications here.`);
})


app.post('/register-reminders', async (req, res) => {
  const { chatId, timestamp, reminders } = req.body;

  console.log('received reminder', { chatId, timestamp, reminders });

  const newReminder = new RemindersModel({
    chatId,
    timestamp,
    reminders
  });

  await newReminder.save();

  bot.sendMessage(chatId, `
    ${reminders[0].text}
    <a href="https://haron-iv.github.io/remnote-reminders-plugin/pwa/?deeplink=${reminders[0].deeplink}">Otwórz Remnote</a>
  `, { parse_mode: 'HTML' })

  res.json({ success: true });
});

app.listen(PORT, async () => {
  console.log(`✅ server is running: http://localhost:${PORT}`);
});