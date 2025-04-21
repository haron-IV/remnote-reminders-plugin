import { ReactRNPlugin } from '@remnote/plugin-sdk'
import debounce from 'lodash.debounce'
import { SEND_REMINDERS_TO_API_DEBOUNCE_MS } from '../../shared/constants'
import { registerReminders } from '../services/services'
import { storage } from '../../shared/storage'

/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 */
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  })

export const mapDateTimeToUTC = (date?: string, time?: string) => {
  if (!date || !time) return ''
  const [day, month, year] = date.split('/').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const reminderDate = new Date(year, month - 1, day, hours, minutes)

  return reminderDate.toISOString() // it formats the date to UTC
}

export const getDeeplink = async (plugin: ReactRNPlugin, remId: string) => {
  const knowledgeBase = await plugin.kb.getCurrentKnowledgeBaseData()
  if (!knowledgeBase) return ''

  return `remnote://w/${knowledgeBase._id}/${remId}`
}

export const updateReminder = debounce(async (remId: string) => {
  const toUpdateIndex = storage.remindersData.reminders.findIndex(
    (reminder) => reminder.remId === remId
  )

  // remove 'removed' reminders from storage
  if (storage.removedReminders.size > 0)
    storage.remindersData.reminders = storage.remindersData.reminders.filter((reminder) => {
      if (!storage.removedReminders.has(reminder.remId)) return true
    })

  if (toUpdateIndex < 0) return
  const { status } = await registerReminders(storage.remindersData)
  if (status === 200) storage.removedReminders.clear()
}, SEND_REMINDERS_TO_API_DEBOUNCE_MS)
