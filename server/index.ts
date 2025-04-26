import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { initDatabaseConnection } from './src/database/database.js'
import { registerRemindersController } from './src/registerRemindersController.js'
import { scheduler } from './src/scheduler.js'
import { env } from './src/env.js'
import { initTelegramMiddlewares } from './src/telegram/telegram.js'
import { log } from './src/logger.js'

const init = () => {
  console.log('\x1b[31m%s\x1b[0m', 'ENV', Object.entries(env))
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
