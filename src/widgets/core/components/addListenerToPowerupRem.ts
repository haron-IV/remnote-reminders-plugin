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
  updateReminder(reminderRem._id, data) // will send over to api if will not be debounced by user change

  plugin.event.addListener(AppEvents.RemChanged, reminderRem._id, async (event) => {
    const isDeleted = !(await plugin.rem.findOne(reminderRem._id))

    // ASK: is it needed? I think it's not because the rem is removed already
    if (isDeleted) plugin.event.removeListener(AppEvents.RemChanged, reminderRem._id)
    else {
      data.date = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date)
      data.time = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time)
      data.text = reminderRem.text?.toLocaleString()
      data.timestamp = new Date().getTime()
    }

    updateReminder(isDeleted ? data.remId : reminderRem._id, data, isDeleted)
  })
}
