import * as dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { initTelegramMiddlewares } from './telegram.js'
import { initDatabaseConnection } from './database.js'
import { registerRemindersController } from './registerRemindersController.js'
import { scheduler } from './scheduler.js'
import { env } from './env.js'

const init = () => {
  if (env.mongodbUri) initDatabaseConnection(env.mongodbUri)
  if (!env.telegramToken) return

  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(bodyParser.json())

  const { telegraf, telegram } = initTelegramMiddlewares(env.telegramToken)

  registerRemindersController(app)

  scheduler(telegram)

  app.listen(env.apiPort, () => {
    console.log(`✅ server is running: http://localhost:${String(env.apiPort)}`)
  })
}

init()
