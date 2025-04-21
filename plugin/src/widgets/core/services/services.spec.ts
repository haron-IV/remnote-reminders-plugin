import { describe, expect, it, vi } from 'vitest'
import { registerReminders, textLimit } from './services'
import type { RemindersData } from '@remnote-reminders-plugin/shared'
import { mapDateTimeToUTC } from '../utils/utils'

describe('services', () => {
  describe('textLimit()', () => {
    it('Should not add ellipsis when text length is less than the limit', () => {
      const text = 'Hello world'
      const result = textLimit(text)

      expect(result).not.toContain('...')
    })

    it('Should add ellipsis when text length is over the limit', () => {
      const text = 'a'.repeat(400) // limit is 390 and it is REMINDER_TEXT_CHARACTER_LIMIT
      const result = textLimit(text)

      expect(result).toContain('...')
    })
  })

  describe('registerReminders()', () => {
    global.fetch = vi.fn()
    it('Should map data UTCTime', async () => {
      const data: RemindersData = {
        reminders: [
          {
            date: '21/10/2025',
            time: '12:00',
            text: 'a'.repeat(400),
            deeplink: 'remnote://some-deeplink',
            remId: 'remId',
            timestamp: 1234567890,
          },
        ],
      }

      await registerReminders(data)

      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining(
          `"UTCTime":"${mapDateTimeToUTC(data.reminders[0].date, data.reminders[0].time)}"`
        ),
      })
    })
  })
})
