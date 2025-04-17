import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import debounce from 'lodash.debounce'
import { storage } from '../../shared/storage'
import { registerReminders } from '../services/services'

let lastReminders: RemObject[] = []

/**
 * @description It's custom function to detect which reminders (rems) were deleted by selecting multiple rems in editor and it celanup the reminders data over API
 * It had to be custom because `reminderRem.hasPowerup()` in .map() of the `plugin.editor.getSelection()` wasn't working
 */
export const cleanRemovedReminders = debounce(async (powerup?: RemObject) => {
  if (!powerup) return
  const reminderRems = await powerup?.taggedRem()
  if (lastReminders.length === 0) lastReminders = reminderRems

  const removedRemindersIds = lastReminders
    .filter((lastReminder) => !reminderRems.some(({ _id }) => _id === lastReminder._id))
    .map((reminderRem) => reminderRem._id)

  const removedRemindersTxt = lastReminders
    .filter((lastReminder) => !reminderRems.some(({ _id }) => _id === lastReminder._id))
    .map((reminderRem) => reminderRem.text?.toLocaleString())

  if (removedRemindersIds.length > 0) {
    const clearedReminders = storage.remindersData.reminders.filter(({ remId }) => {
      if (!removedRemindersIds.includes(remId)) return true
    })
    
    storage.remindersData.reminders = clearedReminders
    registerReminders(storage.remindersData)

    lastReminders = []
  }
}, 200)
