import { Telegraf, Telegram } from 'telegraf'
import { message } from 'telegraf/filters'
import { log } from '../logger'

export const initTelegramMiddlewares = (telegramToken: string) => {
  const telegraf = new Telegraf(telegramToken)
  const telegram = new Telegram(telegramToken)

  telegraf.start((ctx) =>
    ctx.reply(
      `This is your chat id **${String(ctx.chat.id)}** you have to paste it to Remnote plugin settings. It is id of our chat, you will get notifications here.`,
      { parse_mode: 'Markdown' }
    )
  )
  telegraf.on(message('text'), (ctx) => {
    ctx.reply(`Received message: ${ctx.message.text}`)
  })

  telegraf.launch(() => {
    log.info('💬 Telegram bot started')
  })

  return { telegraf, telegram }
}
