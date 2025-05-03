import { describe, expect, it, vi } from 'vitest'
import { pluginMock, remMock } from '../../shared/tests'
import { updateReminder } from '../utils/utils'
import { storage } from '../../shared/storage'
import { addListenerToPowerupRem } from './addListenerToPowerupRem'
import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { registerPowerup } from './registerPowerup'
import { SlotCode } from '../../shared/constants'
import { PropertyType } from '@remnote/plugin-sdk'

vi.mock('@remnote/plugin-sdk', async () => {
  return {
    AppEvents: { RemChanged: 'RemChanged' },
    ReactRNPlugin: vi.fn(),
    PropertyType: {
      DATE: 'DATE',
      TEXT: 'TEXT',
    },
  }
})

vi.mock('../../shared/storage', async () => {
  const actual = await vi.importActual('../../shared/storage')

  return {
    ...actual,
    storage: {
      remindersData: { reminders: [] },
      removedReminders: new Set(),
    },
  }
})

vi.mock('../utils/utils', () => ({
  updateReminder: vi.fn(),
  getDeeplink: vi.fn(() => 'test-deeplink'),
}))

describe('addListenerToPowerupRem()', () => {
  it('Should initialize data', async () => {
    await addListenerToPowerupRem(pluginMock, remMock)
    expect(storage.remindersData.reminders).toHaveLength(1)
  })

  it('should update reminders (api call) on init if not debounced', async () => {
    await addListenerToPowerupRem(pluginMock, remMock)
    expect(updateReminder).toHaveBeenCalledWith(remMock._id)
  })

  it('Should add to removedReminders when rem was deleted', async () => {
    const modifiedRemMock = { ...remMock, _id: undefined } as unknown as RemObject // rem is consider deleted if _id is undefined
    pluginMock.rem.findOne = vi.fn().mockResolvedValue(null)
    pluginMock.event.removeListener = vi.fn()
    await addListenerToPowerupRem(pluginMock, modifiedRemMock)
    const callback = (pluginMock.event.addListener as any).mock.calls[0][2]

    await callback()

    expect(callback).toBeTruthy()
    expect(pluginMock.rem.findOne).toHaveBeenCalled()
    expect(pluginMock.event.removeListener).toHaveBeenCalled()
    expect(storage.removedReminders).toHaveLength(1)
    expect(updateReminder).toHaveBeenCalled()
  })

  it('Should get rem properties and send it over to the API when rem was changed', async () => {
    pluginMock.rem.findOne = vi.fn().mockResolvedValue(remMock)
    pluginMock.event.removeListener = vi.fn()
    await addListenerToPowerupRem(pluginMock, remMock)
    const callback = (pluginMock.event.addListener as any).mock.calls[0][2]

    await callback()

    expect(callback).toBeTruthy()
    expect(pluginMock.rem.findOne).toHaveBeenCalled()
    expect(pluginMock.event.removeListener).toHaveBeenCalled()
    expect(remMock.getPowerupProperty).toHaveBeenCalled()
    expect(updateReminder).toHaveBeenCalled()
  })
})

describe('registerPowerup()', () => {
  it('Should call registerPowerup with correct slots and properties', async () => {
    await registerPowerup(pluginMock)

    expect(pluginMock.app.registerPowerup).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          slots: expect.arrayContaining([
            { code: SlotCode.Date, name: 'Date', propertyType: PropertyType.DATE },
            { code: SlotCode.Time, name: 'Time', propertyType: PropertyType.TEXT },
          ]),
          properties: [
            { code: SlotCode.Date, name: 'Date', propertyType: PropertyType.DATE },
            { code: SlotCode.Time, name: 'Time', propertyType: PropertyType.TEXT },
          ],
        }),
      })
    )
  })

  it('Should call register command', async () => {
    await registerPowerup(pluginMock)
    expect(pluginMock.app.registerCommand).toHaveBeenCalled()
  })
})
