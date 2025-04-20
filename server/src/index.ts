import * as dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { initTelegramMiddlewares } from './telegram.js'
import { initDatabaseConnection } from './database.js'
import { registerRemindersController } from './registerRemindersController.js'
import { scheduler } from './scheduler.js'

const PORT = process.env.PORT ?? 3000
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const MONGODB_URI = process.env.MONGODB_URI

const init = () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not specified')
  if (!TELEGRAM_TOKEN) throw new Error('TELEGRAM_TOKEN not specified')

  initDatabaseConnection(MONGODB_URI)

  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(bodyParser.json())

  const { telegraf, telegram } = initTelegramMiddlewares(TELEGRAM_TOKEN)

  registerRemindersController(app)

  scheduler()

  app.listen(PORT, () => {
    console.log(`✅ server is running: http://localhost:${String(PORT)}`)
  })
}

init()
