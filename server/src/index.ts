import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { initDatabaseConnection } from './database/database.js'
import { registerRemindersController } from './registerRemindersController.js'
import { scheduler } from './scheduler.js'
import { env } from './env.js'
import { initTelegramMiddlewares } from './telegram/telegram.js'
import { log } from './logger.js'

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
    log.info(`✅ server is running: http://localhost:${String(env.apiPort)}`)
  })
}

init()
