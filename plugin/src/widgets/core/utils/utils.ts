import { ReactRNPlugin } from '@remnote/plugin-sdk'
import debounce from 'lodash.debounce'
import { DATE_FORMAT, SEND_REMINDERS_TO_API_DEBOUNCE_MS } from '../../shared/constants'
import { registerReminders } from '../services/services'
import { storage } from '../../shared/storage'
import { parse, setHours, setMinutes } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 */
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

export const mapDateTimeToUTC = (date?: string, time?: string, userTimezone?: string) => {
  if (!date || !time) return ''
  const reminderDate = parse(date, DATE_FORMAT, new Date())
  let dateTime = setHours(reminderDate, Number(time?.split(':')[0]))
  dateTime = setMinutes(dateTime, Number(time?.split(':')[1]))
  const zonedDateTime = userTimezone && toZonedTime(dateTime, userTimezone)
  const utc = zonedDateTime && zonedDateTime.toISOString()

  return utc
}

export const getDeeplink = async (plugin: ReactRNPlugin, remId: string) => {
  const knowledgeBase = await plugin.kb.getCurrentKnowledgeBaseData()
  if (!knowledgeBase || !remId) return ''

  return `remnote://w/${knowledgeBase._id}/${remId}`
}

export const updateReminder = debounce(async (remId: string) => {
  const toUpdateIndex = storage.remindersData.reminders.findIndex(
    (reminder) => reminder.remId === remId
  )

  //TODO: has to be cleared (the Set) because it is not
  // remove removed reminders from storage
  if (storage.removedReminders.size > 0)
    storage.remindersData.reminders = storage.remindersData.reminders.filter((reminder) => {
      if (!storage.removedReminders.has(reminder.remId)) return true
    })

  // TODO: get status of the response and then clear the Set
  if (toUpdateIndex >= 0) await registerReminders(storage.remindersData)

  storage.removedReminders.clear()
}, SEND_REMINDERS_TO_API_DEBOUNCE_MS)
