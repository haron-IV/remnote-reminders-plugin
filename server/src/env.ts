interface Envs {
  apiPort: number
  telegramToken?: string
  mongodbUri?: string
  schedulerIntervalMs: number
}

const exist = (key: string) => {
  if (process.env[key]) return process.env[key]
  else throw new Error(`Missing env variable: ${key}`)
}

export const env: Envs = {
  apiPort: Number(process.env.API_PORT) || 3000,
  get telegramToken() {
    return exist('TELEGRAM_BOT_TOKEN')
  },
  get mongodbUri() {
    return exist('MONGODB_URI')
  },
  schedulerIntervalMs: Number(process.env.SCHEDULER_INTERVAL_MS) || 20_000,
}
