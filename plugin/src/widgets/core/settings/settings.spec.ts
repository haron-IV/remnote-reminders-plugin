import { describe } from 'node:test'
import { expect, it, vi } from 'vitest'
import { getSettings, registerSettings } from './settings'
import { ReactRNPlugin } from '@remnote/plugin-sdk'

describe('settings', () => {
  const plugin = {
    settings: {
      registerStringSetting: vi.fn(),
      getSetting: vi.fn().mockResolvedValue(null),
    },
    app: {
      toast: vi.fn(),
    },
  } as unknown as ReactRNPlugin
  describe('registerSettings()', () => {
    it('Should call registerStringSetting with at least base configuration', async () => {
      await registerSettings(plugin)
      expect(plugin.settings.registerStringSetting).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'chatId',
          title: 'Chat ID',
        })
      )
    })
  })

  describe('getSettings()', () => {
    it('Should show remnote toast when there is no chatId in the settings', async () => {
      await getSettings(plugin)

      expect(plugin.settings.getSetting).toHaveBeenCalledOnce()
      expect(plugin.app.toast).toHaveBeenCalledOnce()
    })
  })
})
