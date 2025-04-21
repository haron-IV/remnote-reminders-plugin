import { describe, expect, it, vi } from 'vitest'
import { initTelegramMiddlewares } from './telegram.js'
import { Telegraf, Telegram } from 'telegraf'

Telegraf.prototype.start = vi.fn()
Telegraf.prototype.on = vi.fn()
Telegraf.prototype.launch = vi.fn()

describe('telegram', () => {
  describe('initTelegramMiddlewares', () => {
    it('Should initialize /start command', () => {
      initTelegramMiddlewares('test-token')
      expect(Telegraf.prototype.start).toHaveBeenCalled()
    })

    it('Should initialize on message middleware', () => {
      initTelegramMiddlewares('test-token')
      expect(Telegraf.prototype.on).toHaveBeenCalled()
    })

    it('Should launch the bot', () => {
      initTelegramMiddlewares('test-token')
      expect(Telegraf.prototype.launch).toHaveBeenCalled()
    })

    it('Should return telegraf & telegram classes', () => {
      const { telegraf, telegram } = initTelegramMiddlewares('test-token')
      expect(telegraf).toBeInstanceOf(Telegraf)
      expect(telegram).toBeInstanceOf(Telegram)
    })
  })
})
