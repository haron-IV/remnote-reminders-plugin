import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { AppEvents, ReactRNPlugin } from '@remnote/plugin-sdk'
import { PowerupCode, SlotCode } from './constants'

interface FocusRemChangedEventReturnType {
  nextRemId?: string
  prevRemId?: string
}

/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 */
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const watchRemChanged = (
  plugin: ReactRNPlugin,
  rem: RemObject,
  callback: (event: FocusRemChangedEventReturnType) => void
) => {
  plugin.event.addListener(
    AppEvents.FocusedRemChange,
    rem._id,
    async (event: FocusRemChangedEventReturnType) => {
      console.log('Rem changed', event)
      callback(event)
    }
  )
}

export const watchReminders = async (plugin: ReactRNPlugin, powerup?: RemObject) => {
  if (!powerup) return

  const reminders = await powerup?.taggedRem()
  reminders.forEach(async (reminder) => {
    const dateRem = await reminder.getPowerupPropertyAsRem(PowerupCode.RemindMe, SlotCode.Date)
    const timeRem = await reminder.getPowerupPropertyAsRem(PowerupCode.RemindMe, SlotCode.Time)

    plugin.event.addListener(AppEvents.RemChanged, dateRem?._id, async (event) => {
      const date = await reminder.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date)
      console.log(date)
    })

    plugin.event.addListener(AppEvents.RemChanged, timeRem?._id, async (event) => {
      const time = await reminder.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time)
      console.log(time)
    })
  })
}
