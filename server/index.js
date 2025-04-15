require('dotenv').config()
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `This is your chat id "${msg.chat.id}" you have to paste it to Remnote plugin settings. It is id of our chat, you will get notifications here.`);
})

app.use(cors())
app.use(express.json());


// app.get('/', (req, res) => {
//   res.send(getHTML());
//   console.log(req, res)
// });


app.post('/register-reminders', (req, res) => {
  const { chatId, timestamp, reminders } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ error: 'Brakuje pola chat_id lub text' });
  }

  bot.sendMessage(chatId, `
    ${text}
    <a href="https://haron-iv.github.io/remnote-reminders-plugin/?deeplink=${deeplink}">Otwórz Remnote</a>
  `, { parse_mode: 'HTML' })

  res.json({ success: true });
});

app.listen(PORT, async () => {
  console.log(`✅ server is running: http://localhost:${PORT}`);
});