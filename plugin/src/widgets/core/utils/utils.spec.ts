import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { getDeeplink, getDefaultTime, mapDateTimeToUTC, updateReminder } from './utils.js'
import { ReactRNPlugin } from '@remnote/plugin-sdk'
import { storage } from '../../shared/storage.js'
import { before } from 'node:test'
import { registerReminders } from '../services/services.js'
import { Reminder } from '@remnote-reminders-plugin/shared'

describe('utils', () => {
  describe('getDefaultTime()', () => {
    it("Should return a string formatted as 'hh:mm' + additional 15 minutes", () => {
      vi.useFakeTimers()
      const fixedDate = new Date('2025-04-21T20:20:00.000Z')
      vi.setSystemTime(fixedDate)

      const time = getDefaultTime()
      const d = new Date(Date.now() + 900000) // 15 minutes from now
      const hours = d.getHours().toPrecision(2)
      const minutes = d.getMinutes()

      expect(time).toBe(`${hours}:${minutes}`)

      vi.useRealTimers()
    })
  })

  describe('mapDateTimeToUTC()', () => {
    it('if date or time is not provided, it should return an empty string', () => {
      const result = mapDateTimeToUTC(undefined, undefined)
      expect(result).toBe('')
    })

    const timezoneCases = [
      {
        timezone: 'Europe/Warsaw',
        expectedDate: '2025-04-21T18:11:00.000Z',
      },
      {
        timezone: 'America/New_York',
        expectedDate: '2025-04-22T00:11:00.000Z',
      },
      {
        timezone: 'Asia/Tokyo',
        expectedDate: '2025-04-21T11:11:00.000Z',
      },
      {
        timezone: 'Australia/Sydney',
        expectedDate: '2025-04-21T10:11:00.000Z',
      },
    ]

    it.each(timezoneCases)(
      'Should format to UTC iso string for different timezones',
      ({ timezone, expectedDate }) => {
        process.env.TZ = timezone
        const date = '21/04/2025'
        const time = '20:11'
        const result = mapDateTimeToUTC(date, time)

        expect(result).toBe(expectedDate)
      }
    )
  })

  describe('getDeeplink()', () => {
    const plugin = {
      kb: {
        getCurrentKnowledgeBaseData: vi.fn().mockResolvedValue({
          _id: 'knowledgebaseId',
        }),
      },
    } as unknown as ReactRNPlugin

    it('should return complete deepling when parameters passed and knowledgebase exist', async () => {
      const remId = 'remId'
      const result = await getDeeplink(plugin, remId)

      expect(result).toBe(`remnote://w/knowledgebaseId/${remId}`)
    })

    it('should return empty deepling when knowledgebase not fetched', async () => {
      plugin.kb.getCurrentKnowledgeBaseData = vi.fn().mockResolvedValue(null)

      const remId = 'remId'
      const result = await getDeeplink(plugin, remId)

      expect(result).toBe('')
    })
  })
  describe('updateReminder()', () => {
    const mockRegisterReminders = vi.fn()
    const mockStorage = {
      remindersData: {
        reminders: [] as Reminder[],
      },
      removedReminders: new Set<string>(),
    }

    beforeAll(() => {
      vi.useFakeTimers()
    })

    beforeEach(() => {
      vi.mock('./storage', () => ({
        default: mockStorage,
      }))

      vi.mock('./api', () => ({
        registerReminders: mockRegisterReminders,
      }))

      mockStorage.remindersData.reminders = []
      mockStorage.removedReminders = new Set()

      mockRegisterReminders.mockClear()
      mockRegisterReminders.mockResolvedValue({ status: 200 })
    })

    afterAll(() => {
      vi.useRealTimers()
    })
    storage.remindersData.reminders = [
      {
        remId: 'remId-123',
        date: '2025-04-21T20:11:00.000Z',
        time: '20:11',
        text: 'Test reminder',
        deeplink: 'remnote://w/knowledgebaseId/remId',
        timestamp: 1234567890,
      },
    ]
    storage.removedReminders = new Set(['remId-123'])

    it('should return early if reminder is not found', async () => {
      storage.remindersData.reminders = [
        {
          remId: '1',
          date: '2025-04-21T20:11:00.000Z',
          time: '20:11',
          text: 'Test reminder',
          deeplink: 'remnote://w/knowledgebaseId/remId',
          timestamp: 1234567890,
        },
      ]
      const remIdToUpdate = 'non-existent-id'

      updateReminder(remIdToUpdate)

      vi.advanceTimersByTime(100)

      expect(mockRegisterReminders).not.toHaveBeenCalled()
      expect(mockStorage.removedReminders.size).toBe(0)
    })
  })
})
