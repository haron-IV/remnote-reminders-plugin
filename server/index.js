require('dotenv').config()
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Poprawnie skonfigurowano bota. Teraz w ustawieniach pluginu podaj ten chat id "${msg.chat.id}" jest to id nszego prywatnego czatu na który bede wysyłał Ci powaidomienia.`);
})

app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.send(getHTML());
  console.log(req, res)
});


app.post('/register-reminder', (req, res) => {
  const { chatId, text, date, time } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ error: 'Brakuje pola chat_id lub text' });
  }

  bot.sendMessage(chatId, `
  <b>Przypomnienie</b>
  <b>Data:</b> ${date}
  <b>Godzina:</b> ${time}
  <b>Treść:</b> ${text}
  <a href="https://www.remnote.com/w/67fbf740b49e999d43b2ad96/MW29HLXWhfI08pNn5">Link</a>
    `, { parse_mode: 'HTML' })

  res.json({ success: true });
});

const getHTML = () => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="refresh" content="0; url=remnote://w/67fbf740b49e999d43b2ad96/MW29HLXWhfIt8pNn5">
    </head>
  </html>`
}

// Uruchomienie serwera
app.listen(PORT, async () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`);

  // const reposnse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })

  // const data = await reposnse.json()
  // console.log(data)
});