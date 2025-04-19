import * as dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { Telegraf, Telegram } from 'telegraf'
import { message } from 'telegraf/filters'

import { RemindersModel } from './schemas.js'
import { RegisterRemindersRequest, RegisterRemindersResponse } from './types.js'

const PORT = process.env.PORT ?? 3000
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const MONGODB_URI = process.env.MONGODB_URI

const init = () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not specified')
  if (!TELEGRAM_TOKEN) throw new Error('TELEGRAM_TOKEN not specified')

  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(bodyParser.json())

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected')
    })
    .catch((err: unknown) => {
      console.log('MongoDB connection error:', err)
    })

  const bot = new Telegraf(TELEGRAM_TOKEN)
  const t = new Telegram(TELEGRAM_TOKEN)

  bot.start((ctx) =>
    ctx.reply(
      `This is your chat id "${String(ctx.chat.id)}" you have to paste it to Remnote plugin settings. It is id of our chat, you will get notifications here.`
    )
  )

  bot.launch(() => {
    console.log('Telegram bot launched')
  })

  bot.on(message('text'), (ctx) => {
    ctx.reply(`Received message: ${ctx.message.text}`)
  })

  app.post(
    '/register-reminders',
    async (req: RegisterRemindersRequest, res: RegisterRemindersResponse) => {
      try {
        const { chatId, reminders, timestamp } = req.body

        console.log('received reminder', { chatId, reminders, timestamp })

        if (!chatId) throw new Error('chatId not specified')

        const newReminder = new RemindersModel({
          chatId,
          reminders,
          timestamp,
        })

        await newReminder.save()

        // the url is url for github pages and the index.html that is inside this repo under /redirection-page directory
        t.sendMessage(
          chatId,
          `<a href="https://haron-iv.github.io/remnote-reminders-plugin/redirection-page/?deeplink=${reminders[0].deeplink}&reminderText=${reminders[0].text}">Otwórz Remnote</a>`,
          {
            parse_mode: 'HTML',
          }
        )

        res.status(200).send(req.body)
      } catch (error: unknown) {
        console.error('Error saving reminders:', error)
        // return res.status(500).json({ error: (error as Error).message, success: false })
      }
    }
  )

  app.listen(PORT, () => {
    console.log(`✅ server is running: http://localhost:${String(PORT)}`)
  })
}

init()
