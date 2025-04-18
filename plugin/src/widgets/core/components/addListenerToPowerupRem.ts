import { AppEvents, ReactRNPlugin } from '@remnote/plugin-sdk'
import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import type { Reminder } from '../../shared/types'
import { PowerupCode, SlotCode } from '../../shared/constants'
import { getDeeplink, updateReminder } from '../utils/utils'
import { storage } from '../../shared/storage'

/**
 * @description It adds listener for the rem you are passing
 * @param reminderRem is the rem that will be listened. It has to be Rem tagged as powerup with properties
 */
export const addListenerToPowerupRem = async (plugin: ReactRNPlugin, reminderRem: RemObject) => {
  const data: Reminder = {
    date: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date),
    time: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time),
    text: reminderRem.text?.toLocaleString(),
    remId: reminderRem._id,
    deeplink: await getDeeplink(plugin, reminderRem._id),
    timestamp: new Date().getTime(),
  }

  storage.remindersData.reminders.push(data) // initialize reminder data
  updateReminder(reminderRem._id) // will send over to api if will not be debounced by user change

  plugin.event.addListener(AppEvents.RemChanged, reminderRem._id, async (event) => {
    const hasPowerup = await reminderRem?.hasPowerup(PowerupCode.RemindMe)
    const isDeleted = !(await plugin.rem.findOne(reminderRem._id))

    if (isDeleted || !hasPowerup) {
      plugin.event.removeListener(AppEvents.RemChanged, reminderRem._id)
      storage.removedReminders.add(data.remId)
    } else {
      data.date = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date)
      data.time = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time)
      data.text = reminderRem.text?.toLocaleString()
      data.timestamp = new Date().getTime()
    }

    await updateReminder(reminderRem._id)
  })
}
