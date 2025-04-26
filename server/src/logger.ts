import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { pino } from 'pino'

const logDir = path.resolve(__dirname, '../logs')
if (!existsSync(logDir)) mkdirSync(logDir)

const fileStream = pino.destination(path.join(logDir, 'app.log'))
const prettyStream = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'dd.mm.yyyy HH:MM:ss',
    ignore: 'pid,hostname',
  },
})

export const log = pino(
  {
    level: 'info',
    formatters: {
      level(label) {
        return { level: label }
      },
    },
  },
  pino.multistream([{ stream: fileStream }, { stream: prettyStream }])
)
