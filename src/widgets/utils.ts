import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { AppEvents, ReactRNPlugin } from '@remnote/plugin-sdk'
import { PowerupCode, SlotCode } from './constants'
import debounce from 'lodash.debounce'
import { RemindersData, Reminder } from './types'
/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 */
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const watchReminders = async (plugin: ReactRNPlugin, powerup?: RemObject) => {
  if (!powerup) return

  const remindersData: RemindersData = {
    chatId: 7700263174, // TODO: get from config later
    timestamp: new Date().getTime(),
    reminders: [],
  }

  const updateReminder = debounce((remId: string, reminder: Reminder) => {
    const toUpdate = remindersData.reminders.findIndex((reminder) => reminder.remId === remId)
    if (toUpdate >= 0) remindersData.reminders[toUpdate] = reminder
    console.log('Updated reminder- API CALL', reminder)
  }, 1000)

  const reminderRems = await powerup?.taggedRem()
  reminderRems.forEach(async (reminderRem) => {
    const data: Reminder = {
      date: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date),
      time: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time),
      text: reminderRem.text?.toLocaleString(),
      remId: reminderRem._id,
      timestamp: new Date().getTime(),
    }

    remindersData.reminders.push(data) // initialize data

    //TODO: remove this event afterwards
    plugin.event.addListener(AppEvents.RemChanged, reminderRem._id, async (event) => {
      data.date = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date)
      data.time = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time)
      data.text = reminderRem.text?.toLocaleString()
      data.timestamp = new Date().getTime()
      updateReminder(reminderRem._id, data)
    })
  })
}
